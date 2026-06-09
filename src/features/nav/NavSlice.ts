import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NavUser } from "./NavTypes";

type NavState = {
  user: NavUser | null;
};

const mockUser: NavUser = {
  loginId: "hospital",
  name: "권수근",
  department: "원무과",
  role: "ADMIN",
};

const initialState: NavState = {
  user: mockUser,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<NavUser | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = navSlice.actions;

export default navSlice.reducer;
