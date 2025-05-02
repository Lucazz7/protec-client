const API_URL = "http://localhost:3001/api/chats";
// const API_URL = "https://protec.biofy.tech/api/v0/";
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
      query: () => "/",
      providesTags: ["Chat"],
    }),
    getChatById: builder.query<Chat, string>({
      query: (id) => `/${id}`,
      providesTags: ["Chat"],
    }),
    createChat: builder.mutation<Chat, { question: string }>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: {
          question: data.question,
        },
      }),
      invalidatesTags: ["Chat"],
    }),
    addMessage: builder.mutation<Chat, { id: string; message: Message }>({
      query: ({ id, message }) => ({
        url: `/${id}/messages`,
        method: "POST",
        body: message,
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
  useAddMessageMutation,
} = chatApi;
