import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { createEventSchema } from "@/lib/validations/schemas";
import { CreateEventInput } from "@/lib/events/types";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface CreateEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

type CreateEventFormValues = Omit<CreateEventInput, "creatorId" | "date"> & {
  date: string;
  webinar?: string;
};

export const CreateEventForm = ({
  onSuccess,
  onCancel,
}: CreateEventFormProps) => {
  const router = useRouter();

  const initialValues: CreateEventFormValues = {
    title: "",
    description: "",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16), // New week at current time
    location: "",
    isOnline: false,
    maxCapacity: 2,
    webinar: "",
  };

  const handleSubmit = async (
    values: CreateEventFormValues,
    { setSubmitting, setErrors }: FormikHelpers<CreateEventFormValues>
  ) => {
    try {
      await axios.post("/api/events/create", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/my-events");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-8">
      <h2 className="mb-8 text-3xl font-bold text-terracotta-400">
        Create New Event
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={createEventSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-8">
            {/* Basic Information Section */}
            <div className="rounded-lg border border-terracotta-500/20 bg-space-300/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-semibold text-terracotta-300">
                Basic Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-terracotta-200"
                  >
                    Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                      text-lunar-300 shadow-sm placeholder:text-lunar-300
                      focus:border-terracotta-400 focus:ring-terracotta-400"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-right text-sm italic text-terracotta-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-terracotta-200"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Describe your event..."
                    className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                      text-lunar-300 shadow-sm placeholder:text-lunar-300
                      focus:border-terracotta-400 focus:ring-terracotta-400"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-1 text-right text-sm italic text-terracotta-300"
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="rounded-lg border border-terracotta-500/20 bg-space-300/30 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-semibold text-terracotta-300">
                Event Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Left panel */}
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-terracotta-200"
                    >
                      Date and Time
                    </label>
                    <Field
                      type="datetime-local"
                      name="date"
                      className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                        text-lunar-300 shadow-sm
                        focus:border-terracotta-400 focus:ring-terracotta-400
                        [&::-webkit-calendar-picker-indicator]:opacity-50
                        [&::-webkit-calendar-picker-indicator]:invert
                        [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="mt-1 text-right text-sm italic text-terracotta-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maxCapacity"
                      className="block text-sm font-medium text-terracotta-200"
                    >
                      Maximum Capacity
                    </label>
                    <Field
                      type="number"
                      name="maxCapacity"
                      min="2"
                      max="500"
                      className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                        text-lunar-300 shadow-sm focus:border-terracotta-400
                        focus:ring-terracotta-400"
                    />
                    <ErrorMessage
                      name="maxCapacity"
                      component="div"
                      className="mt-1 text-right text-sm italic text-terracotta-300"
                    />
                  </div>
                </div>

                {/* Right panel */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-terracotta-200">
                      Event Type
                    </label>
                    <div className="mt-2 flex space-x-6">
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="isOnline"
                          value="false"
                          checked={values.isOnline === false}
                          onChange={() => {
                            setFieldValue("isOnline", false);
                          }}
                          className="size-4 border-terracotta-500/30 text-terracotta-400 focus:ring-terracotta-400"
                        />
                        <span className="ml-2 text-lunar-300">In-person</span>
                      </label>
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="isOnline"
                          value="true"
                          checked={values.isOnline === true}
                          onChange={() => {
                            setFieldValue("isOnline", true);
                          }}
                          className="size-4 border-terracotta-500/30 text-terracotta-400 focus:ring-terracotta-400"
                        />
                        <span className="ml-2 text-lunar-300">Online</span>
                      </label>
                    </div>
                  </div>

                  {!values.isOnline && (
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-terracotta-200"
                      >
                        Location
                      </label>
                      <Field
                        type="text"
                        name="location"
                        placeholder="Enter event location"
                        className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                          text-lunar-300 shadow-sm placeholder:text-lunar-300
                          focus:border-terracotta-400 focus:ring-terracotta-400"
                      />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="mt-1 text-right text-sm italic text-terracotta-300"
                      />
                    </div>
                  )}

                  {values.isOnline && (
                    <div>
                      <label
                        htmlFor="webinar"
                        className="block text-sm font-medium text-terracotta-200"
                      >
                        Meeting Link
                      </label>
                      <Field
                        type="text"
                        name="webinar"
                        placeholder="https://..."
                        className="mt-1 block w-full rounded-md border-terracotta-500/30 bg-space-400/40 px-4 py-2
                          text-lunar-300 shadow-sm placeholder:text-lunar-300
                          focus:border-terracotta-400 focus:ring-terracotta-400"
                      />
                      <ErrorMessage
                        name="webinar"
                        component="div"
                        className="mt-1 text-right text-sm italic text-terracotta-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md border border-terracotta-500/30 px-4 py-2 text-sm font-medium
                    text-terracotta-200 transition-colors hover:bg-space-400/40"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
                  transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
                  focus:ring-terracotta-400 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
