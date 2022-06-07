import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playersApi = createApi({
  reducerPath: "playersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.ggpredict.dev:8080/restapi/players/",
  }),
  endpoints: (builder) => ({
    getPlayersByPage: builder.query({
      query: (page) => `?page=${page}`,
    }),
    getPlayersByPhrase: builder.query({
      query: (phrase) => `?searchBy=${phrase}`,
    }),
  }),
});
export const { useGetPlayersByPageQuery, useGetPlayersByPhraseQuery } =
  playersApi;
