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

/**
 * Handle RTK Query errors when fetching event details
 * @param error
 * @returns A user-friendly error message
 */
export const getEventError = (error: unknown) => {
  if (!error) return null;

  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      switch ((error as any).status) {
        case 403:
          return "You don't have permission to view this event";
        case 404:
          return "Event not found";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "Unable to load event details";
      }
    }
  }
  return "Something went wrong. Please try again.";
};

//
// Handle RTK Query error when applying to an event
export const getJoinEventError = (error: unknown) => {
  if (!error) return null;

  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      switch ((error as any).status) {
        case 400:
          // check for specific error meessages from route
          const msg = (error as any).data?.message || "";
          if (msg.includes("already have applied")) {
            return "You have already applied to this event";
          }
          if (msg.inlcudes("capacity")) {
            return "Event has reached maximum capacity";
          }
          return "Invalid request. Please check your input";
        case 403:
          return "You don't have permission to apply to this event";
        case 404:
          return "Event not found";
        case 409:
          return "The event was modified by another user. Please refresh and try again.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "Failed to join event. Please try again.";
      }
    }
  }
};
