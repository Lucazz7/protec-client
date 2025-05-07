import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../interface/IChat";
import { chatApi } from "../services/chatApi";

interface ChatState {
  chatHistory: Message[];
  error: string | null;
}

const initialState: ChatState = {
  chatHistory: [],
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatHistory: (state, action: PayloadAction<Message[]>) => {
      state.chatHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatApi.endpoints.getChatById.matchFulfilled,
      (state, action) => {
        if (action.payload.error && !action.payload?.id) {
          state.error =
            "Não foi possível carregar os dados de histórico de conversas";
        } else if (
          !state.chatHistory.some((chat) => chat.id !== action.payload?.id)
        ) {
          state.chatHistory = action.payload?.id
            ? [
                {
                  id: action.payload?.id,
                  type: "user",
                  question: action.payload?.question,
                },
                {
                  ...action.payload,
                  id: action.payload?.id,
                },
              ]
            : [];
        }
      }
    );
    builder.addMatcher(chatApi.endpoints.getChatById.matchRejected, (state) => {
      state.chatHistory = [];
      state.error =
        "Não foi possível carregar os dados de histórico de conversas";
    });
  },
});

export const { setChatHistory } = chatSlice.actions;

export default chatSlice.reducer;
