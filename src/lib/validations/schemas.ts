import * as yup from "yup";
import { passwordPolicy } from "@/lib/auth/passwordPolicy";
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
    .test("password policy", function (value) {
      const validation = passwordPolicy.validate(value);
      return validation.valid ? true : this.createError({ message: validation.errors.join("\n") });
    }),
  firstName: yup
    .string()
    .required("User firstname is required")
    .min(2, "firstname must be at least 2 characters")
    .max(50, "firstname must not exceed 50 characters"),
  lastName: yup
    .string()
    .required("User lastname is required")
    .min(2, "lastName must be at least 2 characters")
    .max(50, "lastName must not exceed 50 characters"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .test("password policy", function (value) {
      const validation = passwordPolicy.validate(value);
      return validation.valid ? true : this.createError({ message: validation.errors.join("\n") });
    }),
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
  date: yup.string().required("Date is required"),
  endDate: yup.string().required("End date is required"),
  city: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("City is required"),
    otherwise: (schema) => schema.nullable().default(""),
  }),
  country: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.nullable().default(""),
  }),
  location: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("Location is required for in-person events"),
    otherwise: (schema) => schema.nullable().default(""),
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
  endDate: yup.string().required("End date is required"),
  city: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("City is required"),
    otherwise: (schema) => schema.nullable().default(""),
  }),
  country: yup.string().when("isOnline", {
    is: false,
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.nullable().default(""),
  }),
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
    .oneOf(["ACCEPTED", "REJECTED"], "Status must be either ACCEPTED or REJECTED"),
});
