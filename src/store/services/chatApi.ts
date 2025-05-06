// const API_URL = "http://localhost:3001/api/chats";
const API_URL = "https://protec.biofy.tech/api/v0/";
import { IHistoryQuestion, Message } from "../../interface/IChat";

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
    createChat: builder.mutation<Message, { question: string }>({
      query: (data) => ({
        url: `/generate_sql?question=${data.question}`,
        method: "GET",
      }),
      invalidatesTags: ["Chat"],
    }),
    chatGenerateSql: builder.mutation<Message, string>({
      query: (id) => ({
        url: `/run_sql?id=${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Chat"],
    }),
    addMessage: builder.mutation<
      Message,
      { last_question: string; new_question: string }
    >({
      query: (message) => ({
        url: `/generate_rewritten_question?last_question=${message.last_question}&new_question=${message.new_question}`,
        method: "GET",
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
  useChatGenerateSqlMutation,
  //   addMessage
  useAddMessageMutation,
} = chatApi;
