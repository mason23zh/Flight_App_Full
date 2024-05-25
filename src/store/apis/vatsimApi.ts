import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Event, VatsimControllers, VatsimFlight, VatsimTrackTraffic } from "../../types/";


interface EventResponse {
    result: number,
    events: [Event]
}

interface VatsimTrackResponse {
    data: VatsimTrackTraffic;
}

interface VatsimTrafficResponse {
    data: { results: number, pilots: Array<VatsimFlight> };
}


export const vatsimApi = createApi({
    reducerPath: "vatsim",
    baseQuery: fetchBaseQuery({
        // baseUrl: "https://api.airportweather.org/v1/vatsim",
        baseUrl: "http://127.0.0.1:80/v1/vatsim"
    }),
    endpoints(build) {
        return {
            fetchCurrentVatsimEvents: build.query<EventResponse, void>({
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
            fetchVatsimControllersData: build.query<VatsimControllers, void>({
                query: () => ({
                    url: "/getVatsimControllers",
                    method: "GET",
                })
            }),
            fetchVatsimPilotsData: build.query<VatsimTrafficResponse, void>({
                query: () => ({
                    url: "/getPilots",
                    method: "GET",
                })
            }),
            fetchTrafficTrackData: build.query<VatsimTrackResponse, string>({
                query: (callsign) => ({
                    url: `/getTrafficByCallsign/track/${callsign}`,
                    method: "GET",
                })
            }),
            fetchVatsimTrafficByCallsign: build.query<VatsimTrafficResponse, string>({
                query: (callsign) => ({
                    url: `/getVatsimTrafficByCallsign/${callsign}`,
                    method: "GET"
                })
            })
        };
    },
});
export const {
    useFetchCurrentVatsimEventsQuery,
    useFetchSortedVatsimEventsQuery,
    useFetchVatsimControllersDataQuery,
    useFetchVatsimPilotsDataQuery,
    useFetchTrafficTrackDataQuery,
    useFetchVatsimTrafficByCallsignQuery
} = vatsimApi;
