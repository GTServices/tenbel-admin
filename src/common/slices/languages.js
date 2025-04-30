import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  langs: [],
};

const languageSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    setLanguages: (state, action) => {
      state.langs = action.payload;
    },
  },
});

const { reducer } = languageSlice;
export const { setLanguages } = languageSlice.actions;
export default reducer;
