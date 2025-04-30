import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import logoutService from "../logout.service";

const user = JSON.parse(localStorage.getItem("user"));

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutService();
});

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const logoutSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const { reducer } = logoutSlice;
export default reducer;
