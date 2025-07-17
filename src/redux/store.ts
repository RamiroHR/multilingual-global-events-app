import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/features/authSlice";

export const store = configureStore({
  reducer: {
    // Slices added as key-value pairs. mySlice.name: mySliceReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
