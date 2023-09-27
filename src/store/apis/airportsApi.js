import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const airportsApi = createApi({
    reducerPath: "airports",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/api/v1/airports",
    }),
    endpoints(build) {
        return {
            fetchVatsimPopularAirports: build.query({
                query: ({ limit }) => ({
                    url: `/vatsim-popular-airports?limit=${limit}`,
                    method: "GET",
                }),
            }),
            fetchMostPopularAirports: build.query({
                query: () => ({
                    url: "/get-most-popular-airports",
                    method: "GET",
                }),
            }),
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
            fetchDetailAirportWithICAO_Widget: build.query({
                query: ({ icao, decode }) => ({
                    url: `icao/widget/${icao}?decode=${decode}`,
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
    useFetchDetailAirportWithICAO_WidgetQuery,
    useFetchDetailAirportWithICAO,
    useFetchMostPopularAirportsQuery,
    useFetchVatsimPopularAirportsQuery,
} = airportsApi;
