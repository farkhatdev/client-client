import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

let isAuthenticated = false;
const token = localStorage.getItem("access-token");
if (token) {
  try {
    const { exp } = jwtDecode(token);
    isAuthenticated = exp > Date.now() / 1000;
  } catch (error) {
    console.log(error);
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated,
  },
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});
export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
