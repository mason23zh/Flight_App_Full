import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vatsimApi = createApi({
    reducerPath: "vatsim",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/vatsim",
    }),
    endpoints(build) {
        return {
            fetchCurrentVatsimEvents: build.query({
                query: () => ({
                    url: "/getCurrentEvents",
                    method: "GET",
                }),
            }),
            fetchSortedVatsimEvents: build.query({
                query: () => ({
                    url: "/getSortedEventsByDate",
                    method: "GET",
                }),
            }),
        };
    },
});
export const {
    useFetchCurrentVatsimEventsQuery,
    useFetchSortedVatsimEventsQuery,
} = vatsimApi;
