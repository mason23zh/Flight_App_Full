import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rainviewerApi = createApi({
    reducerPath: "rawinviewerData",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://tilecache.rainviewer.com/api/maps.json",
    }),
    endpoints(build) {
        return {
            fetchRainviewerTimeStamps: build.query<Array<number>, void>({
                query: () => ({
                    url: "",
                    method: "GET",
                }),
            }),
        };
    },
});

export const { useFetchRainviewerTimeStampsQuery } = rainviewerApi;
