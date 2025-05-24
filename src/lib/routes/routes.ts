export default Object.freeze({
  // Authentication
  HOME: "/",
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",

  // Explore Events
  UPCOMING_EVENTS: "/api/events/upcoming",
  DETAIL_EVENT: (eventId: string) => `/api/events/${eventId}`,

  // Creator events
  USER_EVENTS: "/api/events/my-events",
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
  REVIEW_APPLICATION: (participationId: string) => `/api/participation/${participationId}/review`,
});
