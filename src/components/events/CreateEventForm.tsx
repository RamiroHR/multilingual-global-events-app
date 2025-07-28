import { FormikHelpers } from "formik";
import { EventFormBase } from "./EventFormBase";
import { createEventSchema } from "@/lib/validations/schemas";
import { EventFormValues } from "@/lib/types";
import { ObjectSchema } from "yup";
import { useRouter } from "next/navigation";
import { useCreateEventMutation } from "@/redux/services/eventsApi";
import { hasValidationErrors, getCreateEventError } from "@/lib/errors/utils";

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
    version: 1,
  };

  const [createEvent] = useCreateEventMutation();

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

      await createEvent(formData).unwrap();
    } catch (error) {
      console.error("Failed to create event:", error);
      if (hasValidationErrors(error)) {
        helpers.setErrors(error.data.errors);
      } else {
        const errorMessage = getCreateEventError(error) ?? "An Unexpected error ocurred";
        helpers.setStatus({ error: errorMessage });
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
