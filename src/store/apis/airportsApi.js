import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const airportsApi = createApi({
    reducerPath: "airports",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://flight-data.herokuapp.com/api/v1/airports",
    }),
    endpoints(build) {
        return {
            fetchAirportsWithGenericInput: build.query({
                query: (searchTerm) => ({
                    url: `/generic/${searchTerm}`,
                    method: "GET",
                }),
            }),
        };
    },
});

export const { useFetchAirportsWithGenericInputQuery } = airportsApi;
