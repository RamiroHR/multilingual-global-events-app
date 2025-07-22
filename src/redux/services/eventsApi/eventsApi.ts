import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UpcomingEventsEntity, UpcomingEventsQuery } from "./eventsApi.types";
import ROUTES from "@/lib/routes/routes";

// service
export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUpcomingEvents: builder.query<UpcomingEventsEntity, UpcomingEventsQuery>({
      query: ({ page, onlineOnly, country }) =>
        ROUTES.UPCOMING_EVENTS(page, { onlineOnly, country: country ?? undefined }),
    }),
  }),
});

// export service hook
export const { useGetUpcomingEventsQuery } = eventsApi;
export const { useLazyGetUpcomingEventsQuery } = eventsApi;
