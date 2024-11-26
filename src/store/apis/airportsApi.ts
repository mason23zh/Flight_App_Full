import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DbAirport, DetailAirportResponse, PopularVatsimAirport } from "../../types";

interface AirportResponse {
    result: number,
    data: Array<DbAirport>
}

export interface PopularAirportResponse {
    data: Array<DbAirport>;
}

export interface DetailAirportResponseQuery {
    result: number,
    data: Array<DetailAirportResponse>
}

export interface PopularVatsimAirportResponse {
    data: { airports: Array<PopularVatsimAirport> };
}


export const airportsApi = createApi({
    reducerPath: "airports",
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://127.0.0.1:80/v1/airports"
        baseUrl: "https://api.airportweather.org/v1/airports",
    }),
    endpoints(build) {
        return {
            fetchVatsimPopularAirports: build.query<PopularVatsimAirportResponse, { limit: number }>({
                query: ({ limit }) => ({
                    url: `/vatsim-popular-airports?limit=${limit}`,
                    method: "GET",
                }),

                keepUnusedDataFor: 120,
            }),
            fetchMostPopularAirports: build.query<PopularAirportResponse, void>({
                query: () => ({
                    url: "/get-most-popular-airports",
                    method: "GET",
                }),
                keepUnusedDataFor: 120,
            }),
            fetchBasicAirportWithICAO: build.query<AirportResponse, string>({
                query: (icao) => ({
                    url: `/icao/basic/${icao}`,
                    method: "GET",
                }),
            }),
            fetchDetailAirportWithICAO: build.query<DetailAirportResponseQuery, { icao: string, decode: boolean }>({
                query: ({
                    icao,
                    decode
                }) => ({
                    url: `icao/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
            fetchDetailAirportWithICAO_Widget: build.query({
                query: ({
                    icao,
                    decode
                }) => ({
                    url: `icao/widget/${icao}?decode=${decode}`,
                    method: "GET",
                }),
            }),
            fetchAirportsWithGenericInput: build.query({
                query: ({
                    searchTerm,
                    page,
                    limit
                }) => ({
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
    useFetchDetailAirportWithICAOQuery,
    useFetchMostPopularAirportsQuery,
    useFetchVatsimPopularAirportsQuery,
} = airportsApi;
