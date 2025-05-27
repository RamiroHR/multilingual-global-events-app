import { EventFormBase, EventFormValues } from "./EventFormBase";
import { updateEventSchema } from "@/lib/validations/schemas";
import { Event, User } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FormikHelpers } from "formik";

interface EditEventFormProps {
  event: Event & {
    creator: User;
    participants: Array<{
      id: number;
      status: string;
      user: User;
    }>;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditEventForm = ({ event, onSuccess, onCancel }: EditEventFormProps) => {
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

  const handleSubmit = async (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => {
    try {
      await axiosInstance.put(`/api/events/${event.id}/edit`, {
        ...values,
        date: new Date(values.date).toISOString(),
      });
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          helpers.setStatus({
            error: "The event was modified by another user. Please refresh and try again.", // Handle concurrency conflict
          });
        } else if (error.response?.data?.errors) {
          helpers.setErrors(error.response.data.errors); // Handle validation errors: form field specific in Formik
        } else {
          helpers.setStatus({
            error: error.response?.data?.error || "An unexpected error occurred", // Handle any other API errors
          });
        }
      }
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
