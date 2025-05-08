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
    getHistory: builder.query<IHistoryQuestion, void>({
      query: () => "/get_question_history?",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query<Message, string>({
      query: (id) => `load_question?id=${id}`,
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

    relevantMessage: builder.mutation<Message, string>({
      query: (id) => ({
        url: `/mark_question_as_relevant`,
        method: "POST",
        body: {
          question_id: id,
        },
      }),
      invalidatesTags: ["Chat"],
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
} = chatApi;
