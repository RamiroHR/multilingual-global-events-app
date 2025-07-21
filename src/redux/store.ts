import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";
import { countriesApi } from "./services/countriesApi/countriesApi";

export const store = configureStore({
  reducer: {
    // Slices added as key-value pairs. mySlice.name: mySliceReducer,
    auth: authReducer,
    // Add RTK Query Services
    [countriesApi.reducerPath]: countriesApi.reducer,
  },
  // Set middlewares (for caching, invalidation, polling, etc)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(countriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
