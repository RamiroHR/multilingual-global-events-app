import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// base query including the Authorization header for every protected route
export const baseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
