import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const extremeWeatherApi = createApi({
    reducerPath: "extremeWeatherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8001/api/v1/weather",
    }),
    endpoints(build) {
        return {
            fetchMetarsForCountry: build.query({
                query: (countryCode) => {
                    return {
                        url: `/country-weather/${countryCode}`,
                        method: "GET",
                    };
                },
            }),
        };
    },
});

export const { useFetchMetarsForCountryQuery } = extremeWeatherApi;
