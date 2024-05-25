import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const weatherApi = createApi({
    reducerPath: "weather",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:80/v1/weather"

        // baseUrl: "https://api.airportweather.org/v1/waether",
    }),
    endpoints(build) {
        return {
            fetchGenericWeather: build.query({
                query: ({ data }) => ({
                    url: `/search-weather/generic/${data}`,
                    method: "GET",
                }),
            }),
        };
    },
});

export const { useFetchGenericWeatherQuery } = weatherApi;
