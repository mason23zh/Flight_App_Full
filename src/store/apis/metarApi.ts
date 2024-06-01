import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const metarApi = createApi({
    reducerPath: "metar",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/metar",
        // baseUrl: "http://127.0.0.1:80/v1/metar"

    }),
    endpoints(build) {
        return {
            fetchMetarByICAO: build.query({
                query: ({
                    icao,
                    decode
                }) => ({
                    url: `/get-metar/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
            fetchMetarByGenericInput: build.query({
                query: ({ data }) => ({
                    url: `/get-metar/generic/${data}?decode=true`,
                    method: "GET",
                }),
                extraOptions: { maxRetries: 3 },
            }),
        };
    },
});

export const {
    useFetchMetarByICAOQuery,
    useFetchMetarByGenericInputQuery
} = metarApi;
