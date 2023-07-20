import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const airportsApi = createApi({
    reducerPath: "airports",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://flight-data.herokuapp.com/api/v1/airports",
    }),
    endpoints(build) {
        return {
            fetchBasicAirportWithICAO: build.query({
                query: (icao) => ({
                    url: `/icao/basic/${icao}`,
                    method: "GET",
                }),
            }),
            fetchDetailAirportWithICAO: build.query({
                query: ({ icao, decode }) => ({
                    url: `icao/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
            fetchAirportsWithGenericInput: build.query({
                query: ({ searchTerm, page, limit }) => ({
                    url: `/generic/paginate/${searchTerm}?page=${page}&limit=${limit}`,
                    method: "GET",
                }),
            }),
        };
    },
});

export const {
    useFetchAirportsWithGenericInputQuery,
    useFetchBasicAirportWithICAOQuery,
    useFetchDetailAirportWithICAO,
} = airportsApi;
