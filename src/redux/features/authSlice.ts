import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxUser } from "@/redux/types/authSlice.types";

// define interfaces
interface AuthState {
  user: ReduxUser | null;
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
    login: (state, action: PayloadAction<ReduxUser>) => {
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
