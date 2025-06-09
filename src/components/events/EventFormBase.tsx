import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { EventFormBaseProps, EventFormValues } from "@/lib/types";
import { ErrorMessage as CustomErrorMessage } from "@/components/common/ErrorMessage";

export const EventFormBase = ({
  initialValues,
  validationSchema,
  onSubmit,
  submitButtonText,
  title,
  onSuccess,
  onCancel,
}: EventFormBaseProps) => {
  const handleSubmit = async (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => {
    try {
      await onSubmit(values, helpers);
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };

  const errorStyle = "mt-1 text-right text-sm italic text-red-500";
  const labelStyle = "block text-sm font-medium text-terracotta-200";

  const inputFieldStyle =
    "mt-1 block w-full rounded-md border-terracotta-500/30 " +
    "bg-space-400/40 px-4 py-2 text-lunar-300 shadow-sm " +
    "focus:border-terracotta-400 focus:ring-terracotta-400";

  const calendarStyle =
    "[&::-webkit-calendar-picker-indicator]:opacity-50 " +
    "[&::-webkit-calendar-picker-indicator]:invert " +
    "[&::-webkit-calendar-picker-indicator]:hover:opacity-100";

  return (
    <div className="w-full max-w-4xl p-8">
      <h2 className="mb-8 text-3xl font-bold text-terracotta-400">{title}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, status }) => (
          <Form className="space-y-8">
            {/* Form-level error message (Ex: concurrency conflic, api errors */}
            {status?.error && <CustomErrorMessage error={status.error} />}

            {/* Basic Information Section */}
            <div className="rounded-lg border border-terracotta-500/20 bg-space-300/30 p-6 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <h3 className="mb-4 text-xl font-semibold text-terracotta-300">
                  Basic Information
                </h3>
                <div className="flex flex-col">
                  <div className="ml-auto flex items-center gap-4">
                    <label htmlFor="maxCapacity" className={`${labelStyle} whitespace-nowrap`}>
                      Maximum Capacity :
                    </label>
                    <Field
                      type="number"
                      name="maxCapacity"
                      min="2"
                      max="500"
                      className={inputFieldStyle}
                    />
                  </div>
                  <ErrorMessage name="maxCapacity" component="div" className={errorStyle} />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className={labelStyle}>
                    Title
                  </label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    className={inputFieldStyle}
                  />
                  <ErrorMessage name="title" component="div" className={errorStyle} />
                </div>

                <div>
                  <label htmlFor="description" className={labelStyle}>
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Describe your event..."
                    className={inputFieldStyle}
                  />
                  <ErrorMessage name="description" component="div" className={errorStyle} />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="rounded-lg border border-terracotta-500/20 bg-space-300/30 p-6 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-6">
                {/* Left panel */}
                <div className="space-y-5">
                  <h3 className="mb-6 text-xl font-semibold text-terracotta-300">Event Details</h3>

                  <div>
                    <label htmlFor="date" className={labelStyle}>
                      Start Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="date"
                      className={`${inputFieldStyle} ${calendarStyle}`}
                    />
                    <ErrorMessage name="date" component="div" className={errorStyle} />
                  </div>

                  <div>
                    <label htmlFor="endDate" className={labelStyle}>
                      End Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="endDate"
                      className={`${inputFieldStyle} ${calendarStyle}`}
                    />
                    <ErrorMessage name="endDate" component="div" className={errorStyle} />
                  </div>
                </div>

                {/* Right panel */}
                <div className="mt-1 space-y-6">
                  <div>
                    <div className="flex items-center gap-8">
                      <label className={labelStyle}>Event Type: </label>
                      <div className=" flex space-x-6">
                        <label className="inline-flex items-center">
                          <Field
                            type="radio"
                            name="isOnline"
                            value="false"
                            checked={values.isOnline === false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isOnline", e.target.value === "true");
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isOnline", e.target.value === "true");
                            }}
                            className="size-4 border-terracotta-500/30 text-terracotta-400 focus:ring-terracotta-400"
                          />
                          <span className="ml-2 text-lunar-300">Online</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {!values.isOnline && (
                    <>
                      <div className="flex justify-between">
                        <div>
                          <label htmlFor="city" className={labelStyle}>
                            City
                          </label>
                          <Field
                            type="text"
                            name="city"
                            placeholder="Enter event city"
                            className={inputFieldStyle}
                          />
                          <ErrorMessage name="city" component="div" className={errorStyle} />
                        </div>
                        <div>
                          <label htmlFor="country" className={labelStyle}>
                            Country
                          </label>
                          <Field
                            type="text"
                            name="country"
                            placeholder="Enter event country"
                            className={inputFieldStyle}
                          />
                          <ErrorMessage name="country" component="div" className={errorStyle} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="location" className={labelStyle}>
                          Location
                        </label>
                        <Field
                          type="text"
                          name="location"
                          placeholder="Enter event location"
                          className={inputFieldStyle}
                        />
                        <ErrorMessage name="location" component="div" className={errorStyle} />
                      </div>
                    </>
                  )}

                  {values.isOnline && (
                    <div>
                      <label htmlFor="webinar" className={labelStyle}>
                        Meeting Link
                      </label>
                      <Field
                        type="text"
                        name="webinar"
                        placeholder="https://..."
                        className={inputFieldStyle}
                      />
                      <ErrorMessage name="webinar" component="div" className={errorStyle} />
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
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
                  transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
                  focus:ring-terracotta-400 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? `${submitButtonText}...` : submitButtonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
