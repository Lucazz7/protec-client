import { configureStore, createSelector } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import chatSlice from "./redux/chatSlice";
import themeSlice from "./redux/themeSlice";
import { chatApi } from "./services/chatApi";
import { trainingFilesApi } from "./services/trainingFilesApi";

export const store = configureStore({
  reducer: {
    chatSlice: chatSlice,
    themeSlice: themeSlice,
    [chatApi.reducerPath]: chatApi.reducer,
    [trainingFilesApi.reducerPath]: trainingFilesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(chatApi.middleware)
      .concat(trainingFilesApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelect: TypedUseSelectorHook<RootState> = useSelector;

export function useAppSelector<T>(selector: (state: RootState) => T) {
  const memoizedSelector = createSelector(
    (state: RootState) => state,
    selector
  );
  return useAppSelect(memoizedSelector);
}
