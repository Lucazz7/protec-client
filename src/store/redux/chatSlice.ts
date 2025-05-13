import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../interface/IChat";
import { chatApi } from "../services/chatApi";

interface ChatState {
  chatHistory: Message[];
  error: string | null;
  isLoading: boolean;
}

const initialState: ChatState = {
  chatHistory: [],
  error: null,
  isLoading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatHistory: (state, action: PayloadAction<Message[]>) => {
      state.chatHistory = action.payload;
    },
    updateMessage: (
      state,
      action: PayloadAction<{ position: number; is_correct: boolean }>
    ) => {
      const index = state.chatHistory.findIndex(
        (_, index) => index === action.payload.position
      );
      if (index !== -1) {
        state.chatHistory[index] = {
          ...state.chatHistory[index],
          is_correct: action.payload.is_correct,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatApi.endpoints.getChatById.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        if (!action.payload?.id) {
          state.error =
            "Não foi possível carregar os dados de histórico de conversas";
        } else {
          state.chatHistory = [
            {
              id: crypto.randomUUID(),
              response_type: "user",
              question: action.payload?.question,
            },
            {
              ...action.payload,
              id: String(action.payload?.id),
              sql: action.payload?.generated_sql,
              response_type: "SQL_WITH_TABLE",
              is_correct:
                action.payload?.is_relevant === true ? true : undefined,
            },
          ];
        }
      }
    );
    builder.addMatcher(chatApi.endpoints.getChatById.matchPending, (state) => {
      state.isLoading = true;
    });

    builder.addMatcher(chatApi.endpoints.getChatById.matchRejected, (state) => {
      state.chatHistory = [];
      state.isLoading = false;
      state.error =
        "Não foi possível carregar os dados de histórico de conversas";
    });
  },
});

export const { setChatHistory, updateMessage } = chatSlice.actions;

export default chatSlice.reducer;
