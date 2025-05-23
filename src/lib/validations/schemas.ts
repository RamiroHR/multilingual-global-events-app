import * as yup from "yup";

// Auth schemas
export const signupSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Event schemas
export const createEventSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  date: yup.date().required("Date is required").min(new Date(), "Event date must be in the future"),
  location: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("Location is required for in-person events"),
    otherwise: (schema) => schema.nullable(),
  }),
  isOnline: yup.boolean().required("isOnline status is required"),
  maxCapacity: yup
    .number()
    .required("Max capacity is required")
    .min(2, "Max capacity must be at least 2")
    .max(500, "Max capacity must not exceed 500"),
  webinar: yup.string().when("isOnline", {
    is: true,
    then: (schema) => schema.required("Webinar link is required for online events"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const updateEventSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  date: yup.string().required("Date is required"),
  location: yup.string().required("Location is required"),
  isOnline: yup.boolean().required("isOnline status is required"),
  maxCapacity: yup
    .number()
    .required("Max capacity is required")
    .min(2, "Max capacity must be at least 2")
    .max(500, "Max capacity must not exceed 500"),
  webinar: yup.string().when("isOnline", {
    is: true,
    then: (schema) => schema.required("Webinar link is required for online events"),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Event application management schema
export const updateParticipationStatusSchema = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["APPROVED", "REJECTED"], "Status must be either APPROVED or REJECTED"),
});
