import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  theme: boolean;
}

const initialState: ThemeState = {
  theme: localStorage.getItem("theme") === "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
