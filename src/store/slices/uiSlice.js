import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    alert: {
      text: "Error",
      active: false,
      type: "error",
    },
    sidebar: {
      isActive: false,
    },
  },
  reducers: {
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
    setSidebar: (state, action) => {
      state.sidebar = { isActive: action.payload };
    },
  },
});

export const { setAlert, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;
