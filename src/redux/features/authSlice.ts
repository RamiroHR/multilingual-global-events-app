import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types/authStore";

// define interfaces
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// define initial state
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

// define slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // the login reducer & action takes a <User> object as payload
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

// export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
