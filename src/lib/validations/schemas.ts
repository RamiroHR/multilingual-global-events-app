import * as yup from "yup";
// import { passwordPolicy } from "@/lib/auth/passwordPolicy";
import {
  emailSchema,
  usernameSchema,
  passwordSchema,
  firstNameSchema,
  lastNameSchema,
} from "./userFieldsSchemas";

import {
  titleSchema,
  descriptionSchema,
  dateSchema,
  endDateSchema,
  maxCapacitySchema,
  isOnlineSchema,
  citySchema,
  countrySchema,
  locationSchema,
  webinarSchema,
  versionSchema,
} from "./eventFieldsSchemas";

import { statusSchema } from "./subscriptionFieldsSchemas";

// Auth schemas
export const signupSchema = yup.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

// Event schemas
export const createEventSchema = yup.object({
  title: titleSchema,
  description: descriptionSchema,
  date: dateSchema,
  endDate: endDateSchema,
  maxCapacity: maxCapacitySchema,
  isOnline: isOnlineSchema,
  city: citySchema,
  country: countrySchema,
  location: locationSchema,
  webinar: webinarSchema,
});

export const updateEventSchema = createEventSchema.concat(
  yup.object({
    version: versionSchema,
  })
);

// Event application management schema
export const updateParticipationStatusSchema = yup.object({
  status: statusSchema,
});
