import { FormikHelpers } from "formik";
import { EventFormBase } from "./EventFormBase";
import { updateEventSchema } from "@/lib/validations/schemas";
import { ObjectSchema } from "yup";
import { EditEventFormProps, EventFormValues } from "@/lib/types";
import { useEditEventMutation } from "@/redux/services/eventDetailsApi";
import { getEditEventError, hasValidationErrors } from "@/lib/errors/utils";

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

  const [editEvent] = useEditEventMutation();

  const handleSubmit = async (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => {
    try {
      await editEvent({
        eventId: event.id.toString(),
        updatedData: {
          ...values,
          date: new Date(values.date).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          version: values.version,
        },
      }).unwrap();

      onSuccess?.();
    } catch (error) {
      console.error("Failed to update the event details:", error);
      if (hasValidationErrors(error)) {
        helpers.setErrors(error.data.errors);
      } else {
        const errorMessage = getEditEventError(error) ?? "An unexpected error occurred";
        helpers.setStatus({ error: errorMessage });
      }
      throw error; // important to display edit event (by creator) race condition error message.
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
