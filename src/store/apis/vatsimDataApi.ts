import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const vatsimDataApi = createApi({
    reducerPath: "vatsimData",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/vatsim/data",
    }),
    endpoints(build) {
        return {
            fetchVatsimFirBoundaries: build.query({
                query: () => ({
                    url: "/vatsim-firboundaries.json",
                    method: "GET",
                })
            }),
            fetchVatsimFir: build.query({
                query: () => ({
                    url: "/vatsim-firs.json",
                    method: "GET",
                })
            }),
            fetchVatsimTraconBoundaries: build.query({
                query: () => ({
                    url: "/vatsim-traconboundaries.json",
                    method: "GET"
                })
            }),
            fetchVatsimFss: build.query({
                query: () => ({
                    url: "/vatsim-uirs.json",
                    method: "GET"
                })
            })

        };
    }
});

export const {
    useFetchVatsimFirBoundariesQuery,
    useFetchVatsimFirQuery,
    useFetchVatsimFssQuery,
    useFetchVatsimTraconBoundariesQuery
} = vatsimDataApi;