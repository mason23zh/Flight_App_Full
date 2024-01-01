import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Event } from "../../types/";


interface EventResponse {
    result: number,
    events: [Event]
}

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
            fetchSortedVatsimEvents: build.query<EventResponse, void>({
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
