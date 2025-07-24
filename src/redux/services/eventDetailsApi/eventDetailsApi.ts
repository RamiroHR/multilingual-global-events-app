import { createApi } from "@reduxjs/toolkit/query/react";
import ROUTES from "@/lib/routes/routes";
import { baseQuery } from "@/redux/services/baseQuery";
import { EventDetailsQuery, UpdateEventDetailsQuery } from "./eventDetailsApi.types";
import { EventDetailsEntity, ApplyEventEntity, EventEntity } from "./eventDetailsApi.types";

export const eventDetailsApi = createApi({
  reducerPath: "eventDetailsApi",
  baseQuery: baseQuery,
  tagTypes: ["EventDetails"], // available tags
  endpoints: (builder) => ({
    getEventDetails: builder.query<EventDetailsEntity, EventDetailsQuery>({
      query: ({ eventId }) => ROUTES.DETAIL_EVENT(eventId),
      providesTags: (result, error, { eventId }) => [{ type: "EventDetails", id: eventId }],
    }),
    joinEvent: builder.mutation<ApplyEventEntity, EventDetailsQuery>({
      query: ({ eventId }) => ({
        url: ROUTES.APPLY_EVENT(eventId),
        method: "POST",
      }),
      // data to refetch after mutation success
      invalidatesTags: (result, error, { eventId }) => [{ type: "EventDetails", id: eventId }],
    }),
    editEvent: builder.mutation<EventEntity, UpdateEventDetailsQuery>({
      query: ({ eventId, updatedData }) => ({
        url: ROUTES.EDIT_EVENT(eventId),
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: "EventDetails", id: eventId }],
    }),
  }),
});

export const { useGetEventDetailsQuery } = eventDetailsApi;
export const { useJoinEventMutation } = eventDetailsApi;
export const { useEditEventMutation } = eventDetailsApi;
