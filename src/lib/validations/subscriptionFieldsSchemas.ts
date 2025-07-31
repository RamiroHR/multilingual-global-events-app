import * as yup from "yup";

// Subscriptions related field schemas

export const statusSchema = yup
  .string()
  .required("Status is required")
  .oneOf(["ACCEPTED", "REJECTED"], "Status must be either ACCEPTED or REJECTED");
