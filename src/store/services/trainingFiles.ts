// const API_URL = "http://localhost:3001/api/chats";
const API_URL = "http://localhost:8084/api/v0/";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const trainingFilesApi = createApi({
  reducerPath: "trainingFilesApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["TrainingFiles"],
  endpoints: (builder) => ({
    getTrainingFiles: builder.query<any, void>({
      query: () => "/get_training_data?",
      providesTags: ["TrainingFiles"],
    }),
  }),
});

export const { useGetTrainingFilesQuery } = trainingFilesApi;
