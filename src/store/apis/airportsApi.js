import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const airportsApi = createApi({
    reducerPath: "airports",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8001/api/v1/airports",
    }),
    endpoints(build) {
        return {
            fetchAirportsWithGenericInput: build.query({
                query: (searchTerm) => {
                    return {
                        url: `/generic/${searchTerm}`,
                        method: "GET",
                    };
                },
            }),
        };
    },
});

export const { useFetchAirportsWithGenericInputQuery } = airportsApi;
