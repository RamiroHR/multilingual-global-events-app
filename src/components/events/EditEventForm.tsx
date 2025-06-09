import { FormikHelpers } from "formik";
import { EventFormBase } from "./EventFormBase";
import { updateEventSchema } from "@/lib/validations/schemas";
import { ObjectSchema } from "yup";
import { EditEventFormProps, EventFormValues } from "@/lib/types";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import ROUTES from "@/lib/routes/routes";

export const EditEventForm = ({ event, onSuccess, onCancel }: EditEventFormProps) => {
  const initialValues: EventFormValues = {
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().slice(0, 16),
    endDate: new Date(event.endDate).toISOString().slice(0, 16),
    city: event.city || "",
    country: event.country || "",
    location: event.location || "",
    isOnline: event.isOnline,
    maxCapacity: event.maxCapacity,
    webinar: event.webinar || "",
    version: event.version,
  };

  const handleSubmit = async (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => {
    try {
      await axiosInstance.put(ROUTES.EDIT_EVENT(event.id.toString()), {
        ...values,
        date: new Date(values.date).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        version: values.version,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          helpers.setStatus({
            error:
              error.response.data.message ||
              "The event was modified by another user. Please refresh and try again.", // Handle concurrency conflict
          });
        } else if (error.response?.data?.errors) {
          helpers.setErrors(error.response.data.errors); // Handle validation errors: form field specific in Formik
        } else {
          helpers.setStatus({
            error: error.response?.data?.error || "An unexpected error occurred", // Handle any other API errors
          });
        }
      }
      throw error;
    }
  };

  return (
    <EventFormBase
      initialValues={initialValues}
      //this schema validates an object with the shape of EventFormValues:
      validationSchema={updateEventSchema as ObjectSchema<EventFormValues>}
      onSubmit={handleSubmit}
      submitButtonText="Save Changes"
      title="Edit Event"
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
};
