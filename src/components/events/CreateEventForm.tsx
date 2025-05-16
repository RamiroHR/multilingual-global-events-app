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
    <div className="w-200 mx-auto max-w-2xl p-6">
      <h2 className="mb-6 text-2xl font-bold text-terracotta-800">
        Create New Event
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={createEventSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-space-300"
              >
                Title
              </label>
              <Field
                type="text"
                name="title"
                className="mt-1 block w-full rounded-md border-lunar-200 text-gray-400 shadow-sm focus:border-cosmic-500 focus:ring-cosmic-500"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-space-300"
              >
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-lunar-200 text-gray-400 shadow-sm focus:border-cosmic-500 focus:ring-cosmic-500"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-space-300"
              >
                Date and Time
              </label>
              <Field
                type="datetime-local"
                name="date"
                className="mt-1 block w-full rounded-md border-lunar-200 text-gray-400 shadow-sm focus:border-cosmic-500 focus:ring-cosmic-500"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-space-300 ">
                Event Type
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <Field
                    type="radio"
                    name="isOnline"
                    value="false"
                    className="text-cosmic-500 focus:ring-cosmic-500"
                  />
                  <span className="ml-2">In-person</span>
                </label>
                <label className="inline-flex items-center">
                  <Field
                    type="radio"
                    name="isOnline"
                    value="true"
                    className="text-cosmic-500 focus:ring-cosmic-500"
                  />
                  <span className="ml-2">Online</span>
                </label>
              </div>
            </div>

            {!values.isOnline && (
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-space-300"
                >
                  Location
                </label>
                <Field
                  type="text"
                  name="location"
                  className="mt-1 block w-full rounded-md border-lunar-200 shadow-sm focus:border-cosmic-500 focus:ring-cosmic-500"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="mt-1 text-sm text-terracotta-500"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="maxCapacity"
                className="block text-sm font-medium text-space-300"
              >
                Maximum Capacity
              </label>
              <Field
                type="number"
                name="maxCapacity"
                min="2"
                max="500"
                className="mt-1 block w-full rounded-md border-lunar-200 text-gray-400 shadow-sm focus:border-cosmic-500 focus:ring-cosmic-500"
              />
              <ErrorMessage
                name="maxCapacity"
                component="div"
                className="mt-1 text-sm text-terracotta-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-space-300 hover:text-space-100"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-cosmic-500 px-4 py-2 text-sm font-medium text-white hover:bg-cosmic-600 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:ring-offset-2 disabled:opacity-50"
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
