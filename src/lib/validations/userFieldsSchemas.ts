import * as yup from "yup";
import { passwordPolicy } from "@/lib/auth/passwordPolicy";

// User related fields:
export const emailSchema = yup.string().email("Invalid email format").required("Email is required");

export const usernameSchema = yup
  .string()
  .required("Username is required")
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must not exceed 50 characters");

export const passwordSchema = yup
  .string()
  .required("Password is required")
  .test("password policy", function (value) {
    const validation = passwordPolicy.validate(value);
    return validation.valid ? true : this.createError({ message: validation.errors.join("\n") });
  });

export const firstNameSchema = yup
  .string()
  .required("User firstname is required")
  .min(2, "firstname must be at least 2 characters")
  .max(50, "firstname must not exceed 50 characters");

export const lastNameSchema = yup
  .string()
  .required("User lastname is required")
  .min(2, "lastName must be at least 2 characters")
  .max(50, "lastName must not exceed 50 characters");
