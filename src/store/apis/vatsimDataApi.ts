import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import GeoJson from "geojson";
import { VatsimFirs, VatsimFss } from "../../types";

export const vatsimDataApi = createApi({
    reducerPath: "vatsimData",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/vatsim/data",
        // baseUrl: "http://127.0.0.1:80/v1/vatsim/data"

    }),
    endpoints(build) {
        return {
            fetchVatsimFirBoundaries: build.query<GeoJson.FeatureCollection, void>({
                query: () => ({
                    url: "/vatsim-firboundaries.json",
                    method: "GET",
                })
            }),
            fetchVatsimFir: build.query<VatsimFirs, void>({
                query: () => ({
                    url: "/vatsim-firs.json",
                    method: "GET",
                })
            }),
            fetchVatsimTraconBoundaries: build.query<GeoJson.FeatureCollection, void>({
                query: () => ({
                    url: "/vatsim-traconboundaries.json",
                    method: "GET"
                })
            }),
            fetchVatsimFss: build.query<VatsimFss, void>({
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