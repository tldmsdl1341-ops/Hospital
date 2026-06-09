import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SidebarItem } from "./SidebarTypes";

type SidebarState = {
  items: SidebarItem[];
  loading: boolean;
  error: string | null;
};

const initialState: SidebarState = {
  items: [],
  loading: false,
  error: null,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    fetchSidebarRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSidebarSuccess(state, action: PayloadAction<SidebarItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchSidebarFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSidebarRequest,
  fetchSidebarSuccess,
  fetchSidebarFailure,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
