// const API_URL = "http://localhost:3001/api/chats";
// const API_URL = "http://localhost:8084/api/v0/";
const API_URL = "http://167.234.225.105:6543/";

import {
  IHistoryQuestion,
  IResponseMessage,
  Message,
} from "../../interface/IChat";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Chat } from "../../interface/IChat";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getChats: builder.query<Chat[], void>({
      query: () => "/",
      providesTags: ["Chat"],
    }),
    getHistory: builder.query<IHistoryQuestion[], void>({
      query: () => "/question/all",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query<IHistoryQuestion, string>({
      query: (id) => `question/${id}`,
      providesTags: ["Chat"],
    }),
    createChat: builder.mutation<IResponseMessage, { question: string }>({
      query: (data) => ({
        url: `/make_question`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    questionUpdate: builder.mutation<
      IResponseMessage,
      {
        id: string;
        question: string;
        generated_sql: string;
        is_relevant: boolean;
      }
    >({
      query: (data) => ({
        url: `/question/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    relevantMessage: builder.mutation<Message, string>({
      query: (id) => ({
        url: `/question/mark_question_as_relevant`,
        method: "POST",
        body: {
          question_id: id,
        },
      }),
    }),
  }),
});

export const {
  //   getChat
  useGetChatsQuery,
  useGetChatByIdQuery,
  useGetHistoryQuery,
  //   createChat
  useCreateChatMutation,
  //   addMessage
  useRelevantMessageMutation,
  //   updateSQL
  useQuestionUpdateMutation,
} = chatApi;
