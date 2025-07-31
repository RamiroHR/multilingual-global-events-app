import { createApi } from "@reduxjs/toolkit/query/react";
import { UserEventsQuery, UpcomingEventsQuery, createEventQuery } from "./eventsApi.types";
import { UpcomingEventsEntity, UserEventsEntity, createEventEntity } from "./eventsApi.types";
import ROUTES from "@/lib/routes/routes";
import { baseQuery } from "@/redux/services/baseQuery";

// service
export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: baseQuery,
  tagTypes: ["UserEvents"],
  endpoints: (builder) => ({
    getUpcomingEvents: builder.query<UpcomingEventsEntity, UpcomingEventsQuery>({
      query: ({ page, onlineOnly, country }) =>
        ROUTES.UPCOMING_EVENTS(page, { onlineOnly, country: country ?? undefined }),
    }),
    getUserEvents: builder.query<UserEventsEntity, UserEventsQuery>({
      query: ({ timeFilter, orderBy }) => ROUTES.USER_EVENTS({ timeFilter, orderBy }),
      providesTags: ["UserEvents"],
    }),
    createEvent: builder.mutation<createEventEntity, createEventQuery>({
      query: (eventData) => ({
        url: ROUTES.CREATE_EVENT,
        method: "POST",
        body: eventData,
      }),
      invalidatesTags: ["UserEvents"],
    }),
  }),
});

// export service hook
export const { useGetUpcomingEventsQuery, useGetUserEventsQuery, useCreateEventMutation } =
  eventsApi;
export const { useLazyGetUpcomingEventsQuery } = eventsApi;
