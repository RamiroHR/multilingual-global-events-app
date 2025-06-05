import { FormikHelpers } from "formik";
import { EventFormBase } from "./EventFormBase";
import { createEventSchema } from "@/lib/validations/schemas";
import { EventFormValues } from "@/lib/types";
import { ObjectSchema } from "yup";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import ROUTES from "@/lib/routes/routes";

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateEventForm = ({ onSuccess, onCancel }: CreateEventFormProps) => {
  const router = useRouter();

  const initialValues: EventFormValues = {
    title: "",
    description: "",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Next week at current time
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Next week + 1 day
    city: "",
    country: "",
    location: "",
    isOnline: false,
    maxCapacity: 2,
    webinar: "",
  };

  const handleSubmit = async (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => {
    try {
      // For online events
      if (values.isOnline === true) {
        if (!values.webinar) {
          helpers.setErrors({ webinar: "Webinar link is required for online events" });
          return;
        }
        // For online events, we can set location to empty string
        values.location = "";
      }
      // For in-person events
      else if (values.isOnline === false) {
        if (!values.location) {
          helpers.setErrors({ location: "Location is required for in-person events" });
          return;
        }
      }

      // Convert date strings to Date objects
      const formData = {
        ...values,
        date: new Date(values.date),
        endDate: new Date(values.endDate),
      };

      await axiosInstance.post(ROUTES.CREATE_EVENT, formData);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/my-events");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          helpers.setErrors(error.response.data.errors);
        } else {
          helpers.setStatus({
            error: error.response?.data?.error || "An unexpected error occurred",
          });
        }
      }
    }
  };

  return (
    <EventFormBase
      initialValues={initialValues}
      //this schema validates an object with the shape of EventFormValues:
      validationSchema={createEventSchema as ObjectSchema<EventFormValues>}
      onSubmit={handleSubmit}
      submitButtonText="Create Event"
      title="Create New Event"
      onSuccess={onSuccess || (() => router.push("/dashboard/my-events"))}
      onCancel={onCancel}
    />
  );
};
