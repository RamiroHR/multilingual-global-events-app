/**
 * Extract the error message from the RTK Query hook error state
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (error: unknown) => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    if ("status" in error && "data" in error) {
      // Try to extract message from data
      if (typeof (error as any).data === "string") return (error as any).data;
      if (typeof (error as any).data?.message === "string") return (error as any).data.message;
      return `Error: ${JSON.stringify(error)}`;
    }
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
  }
  return "An unknown error occurred";
};
/* eslint-disable @typescript-eslint/no-explicit-any */

type ErrorMessageHandler = (error: unknown) => string | null;
type ErrorMessages = {
  [key: number]: string | ErrorMessageHandler;
  default?: string;
};

/**
 * Creates custom "get Error" function for each message structure type object
 * @param messages
 * @returns a function that convert 'RTK Query error' to a user-friendly version from 'messages'
 */
const createErrorHandler = (messages: ErrorMessages) => (error: unknown) => {
  if (!error) return null;

  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as any).status;
    const messageHandler = messages[status];

    if (typeof messageHandler === "function") {
      return messageHandler(error);
    } else if (typeof messageHandler === "string") {
      return messageHandler;
    }
  }

  return messages.default || "Something went wrong. Please try again.";
};

// Base configuration for common error messages
const BASE_ERROR_MESSAGES: ErrorMessages = {
  404: "Resource not found",
  409: "The resource was modified by another user. Please refresh and try again.",
  500: "Server error. Please try again later.",
  default: "Something went wrong. Please try again.",
};

// Create handlers with base + overrides:

// Get Event Details errors
export const getEventError = createErrorHandler({
  ...BASE_ERROR_MESSAGES,
  403: "You don't have permission to view this event",
  404: "Event not found",
  default: "Unable to load event details",
});

// Apply event errors
export const getJoinEventError = createErrorHandler({
  ...BASE_ERROR_MESSAGES,
  400: (error: unknown) => {
    const msg = (error as any).data?.message || "";
    if (msg.includes("already have applied")) {
      return "You have already applied to this event";
    }
    if (msg.includes("capacity")) {
      return "Event has reached maximum capacity";
    }
    return "Invalid request. Please check your input";
  },
  403: "You don't have permission to apply to this event",
  404: "Event not found",
  409: "The event was modified by another user. Please refresh and try again.",
  default: "Failed to join event. Please try again",
});

// Edit Event errors
export const getEditEventError = createErrorHandler({
  ...BASE_ERROR_MESSAGES,
  400: (error: unknown) => {
    const msg = (error as any).data?.message || "";
    if (msg.includes("Event ID is required")) {
      return "Invalid request: Event Id is required.";
    }
    if (msg.includes("Invalid request data")) {
      return "Invalid Input data. Please check your input.";
    }
    return "Invalid request.";
  },
  403: "You don't have permission to edit this event",
  404: "Event not found",
  default: "Failed to modify the event. Please try again",
});

export const hasValidationErrors = (
  err: unknown
): err is { data: { errors: Record<string, string> } } => {
  return (
    err &&
    typeof err === "object" &&
    "data" in err &&
    (err as any).data?.errors &&
    typeof (err as any).data.errors === "object"
  );
};

// Cancel Event errors
export const getCancelEventError = createErrorHandler({
  ...BASE_ERROR_MESSAGES,
  400: (error: unknown) => {
    const msg = (error as any).data?.message || "";
    if (msg.includes("Event ID is required")) {
      return "Bad request: event ID is required";
    }
    if (msg.includes("Version is required")) {
      return "Bad request: Version is required";
    }
    return "Invalid request";
  },
  403: "You don't have permission to cancel this event",
  404: "Event not found",
  409: (error: unknown) => {
    const msg = (error as any).data?.message || "";
    if (msg.includes("already cancelled")) {
      return "The event was already cancelled. Please continue.";
    }
    if (msg.includes("modified by another user")) {
      return "The event was modified by another user. Please refresh and try again.";
    }
    return "The event has been modified meanwhile. Please refresh and try again.";
  },
});
