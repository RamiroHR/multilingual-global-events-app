import * as yup from "yup";

// Event related field schemas

export const titleSchema = yup
  .string()
  .required("Title is required")
  .min(3, "Title must be at least 3 characters")
  .max(100, "Title must not exceed 100 characters");

export const descriptionSchema = yup
  .string()
  .required("Description is required")
  .min(10, "Description must be at least 10 characters")
  .max(1000, "Description must not exceed 1000 characters");

export const dateSchema = yup.string().required("Date is required");

export const endDateSchema = yup
  .string()
  .required("End date is required")
  .test("end-date-after-start", "End date must be after start date", function (value) {
    const startDate = this.parent.date;
    if (!startDate || !value) return true;
    return new Date(value) > new Date(startDate);
  });

export const maxCapacitySchema = yup
  .number()
  .required("Max capacity is required")
  .min(2, "Max capacity must be at least 2")
  .max(500, "Max capacity must not exceed 500");

export const isOnlineSchema = yup.boolean().required("isOnline status is required");

export const citySchema = yup.string().when("isOnline", {
  is: false,
  then: (schema) => schema.required("City is required"),
  otherwise: (schema) => schema.nullable().default(""),
});

export const countrySchema = yup.string().when("isOnline", {
  is: false,
  then: (schema) => schema.required("Country is required"),
  otherwise: (schema) => schema.nullable().default(""),
});

export const locationSchema = yup.string().when("isOnline", {
  is: false,
  then: (schema) => schema.required("Location is required for in-person events"),
  otherwise: (schema) => schema.nullable().default(""),
});

export const webinarSchema = yup.string().when("isOnline", {
  is: true,
  then: (schema) => schema.required("Webinar link is required for online events"),
  otherwise: (schema) => schema.nullable(),
});

export const versionSchema = yup
  .number()
  .required("Version is required")
  .min(1, "Version must be at least 1");
