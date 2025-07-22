import { createApi } from "@reduxjs/toolkit/query/react";
import { UpcomingEventsEntity, UpcomingEventsQuery } from "./eventsApi.types";
import ROUTES from "@/lib/routes/routes";
import { baseQuery } from "@/redux/services/baseQuery";

// service
export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: baseQuery,
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
