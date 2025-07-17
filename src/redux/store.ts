import { configureStore } from "@reduxjs/toolkit";
// import the slices

export const store = configureStore({
  reducer: {
    // key:slices go here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
