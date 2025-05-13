// const API_URL = "http://localhost:3001/api/chats";
const API_URL = "http://167.234.225.105:6543/";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IDataRelevantQuestions,
  IDataTrainingFiles,
} from "../../interface/ITreiningFiles";

export const trainingFilesApi = createApi({
  reducerPath: "trainingFilesApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["TrainingFiles"],
  endpoints: (builder) => ({
    getAllDLLFiles: builder.query<IDataTrainingFiles[], void>({
      query: () => "/ddl/all",
      providesTags: ["TrainingFiles"],
    }),
    getAllRelevantQuestions: builder.query<IDataRelevantQuestions[], void>({
      query: () => "/relevant_questions/",
      providesTags: ["TrainingFiles"],
    }),
  }),
});

export const { useGetAllDLLFilesQuery, useGetAllRelevantQuestionsQuery } =
  trainingFilesApi;
