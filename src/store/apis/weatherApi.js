import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const weatherApi = createApi({
    reducerPath: "weather",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://flight-data.herokuapp.com/api/v1/waether",
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
