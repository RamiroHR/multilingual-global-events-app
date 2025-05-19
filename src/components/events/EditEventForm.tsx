import { EventFormBase, EventFormValues } from "./EventFormBase";
import { updateEventSchema } from "@/lib/validations/schemas";
import { CreateEventInput } from "@/lib/events/types";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormikHelpers } from "formik";

interface EditEventFormProps {
  event: CreateEventInput & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditEventForm = ({
  event,
  onSuccess,
  onCancel,
}: EditEventFormProps) => {
  const router = useRouter();

  const initialValues: EventFormValues = {
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().slice(0, 16),
    location: event.location || "",
    isOnline: event.isOnline,
    maxCapacity: event.maxCapacity,
    webinar: event.webinar || "",
  };

  const handleSubmit = async (
    values: EventFormValues,
    helpers: FormikHelpers<EventFormValues>
  ) => {
    try {
      console.log("Submitting update for event:", event.id);
      console.log("Update data:", values);
      const { webinar, ...updateData } = values;

      const response = await axios.put(
        `/api/events/${event.id}/edit`,
        {
          ...updateData,
          date: new Date(values.date).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Update response:", response.data);
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof AxiosError && error.response?.data?.errors) {
        helpers.setErrors(error.response.data.errors);
      }
      throw error;
    }
  };

  return (
    <EventFormBase
      initialValues={initialValues}
      validationSchema={updateEventSchema}
      onSubmit={handleSubmit}
      submitButtonText="Save Changes"
      title="Edit Event"
      onSuccess={onSuccess || (() => router.push("/dashboard/my-events"))}
      onCancel={onCancel || (() => router.back())}
    />
  );
};
