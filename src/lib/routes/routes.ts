export default Object.freeze({
  // Authentication
  HOME: "/",
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  VERIFY: "/api/auth/verify",

  // Explore Events
  UPCOMING_EVENTS: (page: number) => `/api/events/upcoming?page=${page}`,
  DETAIL_EVENT: (eventId: string) => `/api/events/${eventId}`,

  // Creator events
  USER_EVENTS: (params?: { timeFilter?: string; orderBy?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.timeFilter) queryParams.append("timeFilter", params.timeFilter);
    if (params?.orderBy) queryParams.append("orderBy", params.orderBy);
    return `/api/events/my-events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  },
  CREATE_EVENT: "/api/events/create",
  EDIT_EVENT: (eventId: string) => `/api/events/${eventId}/edit`,
  CANCEL_EVENT: (eventId: string) => `/api/events/${eventId}/cancel`,

  // User Participations
  USER_PARTICIPATIONS: "/api/participation",
  PARTICIPATION_ID: (participationId: string) => `/api/participation/${participationId}`,
  APPLY_EVENT: (eventId: string) => `/api/events/${eventId}/apply`,
  CANCEL_PARTICIPATION: (participationId: string) => `/api/participation/${participationId}/cancel`,

  // Applications management by creators
  EVENT_APPLICATIONS: (eventId: string) => `/api/events/my-events/${eventId}/applications`,
  REVIEW_APPLICATION: (participationId: number) => `/api/participation/${participationId}/review`,
});
