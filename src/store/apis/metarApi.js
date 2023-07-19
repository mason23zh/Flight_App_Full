import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const metarApi = createApi({
    reducerPath: "metar",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://flight-data.herokuapp.com/api/v1/metar",
    }),
    endpoints(build) {
        return {
            fetchMetarByICAO: build.query({
                query: ({ icao, decode }) => ({
                    url: `/get-metar/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
        };
    },
});

export const { useFetchMetarByICAOQuery } = metarApi;
