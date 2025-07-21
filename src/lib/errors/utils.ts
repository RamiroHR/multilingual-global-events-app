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
