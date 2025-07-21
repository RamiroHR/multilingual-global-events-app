import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ROUTES from "@/lib/routes/routes";
import { CountriesEntity } from "./countriesApi.types";

// create and export service
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesEntity, void>({ query: () => ROUTES.ALL_COUNTRIES }),
  }),
});

// export service hook
export const { useGetCountriesQuery } = countriesApi;
