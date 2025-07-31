import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";
import { countriesApi } from "./services/countriesApi/countriesApi";
import { eventsApi } from "./services/eventsApi/eventsApi";
import { eventDetailsApi } from "./services/eventDetailsApi/eventDetailsApi";

export const store = configureStore({
  reducer: {
    // RTK Slices
    auth: authReducer,

    // RTK Query Services
    [countriesApi.reducerPath]: countriesApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [eventDetailsApi.reducerPath]: eventDetailsApi.reducer,
  },

  // Middlewares (for caching, invalidation, polling, etc)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(countriesApi.middleware)
      .concat(eventsApi.middleware)
      .concat(eventDetailsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
