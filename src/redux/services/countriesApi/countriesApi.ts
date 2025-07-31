import { createApi } from "@reduxjs/toolkit/query/react";
import ROUTES from "@/lib/routes/routes";
import { CountriesEntity } from "./countriesApi.types";
import { baseQuery } from "@/redux/services/baseQuery";

// create and export service
export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCountries: builder.query<CountriesEntity, void>({ query: () => ROUTES.ALL_COUNTRIES }),
  }),
});

// export service hook
export const { useGetCountriesQuery } = countriesApi;
