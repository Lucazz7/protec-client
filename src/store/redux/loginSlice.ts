/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginApi } from "../services/loginApi";

export interface IUserState {
  error: string | null;
  isAuthenticated?: boolean;
  jwt: string | null;
  loading: boolean;
}

const initialState: IUserState = {
  error: null,
  loading: false,
  jwt: null,
  isAuthenticated: false,
};

const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(loginApi.endpoints.login.matchPending, (state: any) => {
      state.loading = true;
    }),
      builder.addMatcher(
        loginApi.endpoints.login.matchFulfilled,
        (state, { payload: { access_token: JWT } }) => {
          state.jwt = JWT;
          state.isAuthenticated = JWT ? true : false;
        }
      );
    builder
      .addMatcher(
        loginApi.endpoints.login.matchFulfilled,
        (state, { payload: { access_token: JWT } }) => {
          state.jwt = JWT;
          state.isAuthenticated = JWT ? true : false;
        }
      )
      .addMatcher(
        loginApi.endpoints.login.matchRejected,
        (state: any, action: PayloadAction<any>) => {
          state.error = action.payload;
        }
      );
  },
});

export default loginSlice.reducer;

export const { logout } = loginSlice.actions;
