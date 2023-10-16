import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tafApi = createApi({
    reducerPath: "taf",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/taf",
    }),
    endpoints(build) {
        return {
            fetchTafByICAO: build.query({
                query: ({ icao, decode }) => ({
                    url: `/get-taf/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
        };
    },
});

export const { useFetchTafByICAOQuery } = tafApi;
