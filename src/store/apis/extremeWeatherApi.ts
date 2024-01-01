import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    BARO,
    CONTINENT,
    COUNTRY,
    GLOBAL,
    TEMPERATURE,
    VISIBILITY,
    WIND_GUST,
    WIND_SPEED,
} from "../../util/selection_names";

const generateURL = (weather, scope, code) => {
    let url_scope = "global-weather";
    let url_weather_selection = "wind-gust-speed";
    let url_code_flag = false;
    let tempCode;
    if (scope === GLOBAL) {
        url_scope = "global-weather";
        url_code_flag = false;
    } else if (scope === COUNTRY) {
        url_scope = "country-weather";
        url_code_flag = true;
    } else if (scope === CONTINENT) {
        url_scope = "continent-weather";
        url_code_flag = true;
    }

    if (!code.code) {
        if (scope === COUNTRY && !code.value) {
            tempCode = "ca";
        } else if (scope === CONTINENT && !code.code) {
            tempCode = "na";
        }
    }

    if (weather === WIND_GUST) {
        url_weather_selection = url_code_flag === true ? `wind-gust-speed/${code.value || tempCode}` : "wind-gust-speed";
    } else if (weather === WIND_SPEED) {
        url_weather_selection = url_code_flag === true ? `wind-speed/${code.value || tempCode}` : "wind-speed";
    } else if (weather === VISIBILITY) {
        url_weather_selection = url_code_flag === true ? `visibility/${code.value || tempCode}` : "visibility";
    } else if (weather === BARO) {
        url_weather_selection = url_code_flag === true ? `baro/${code.value || tempCode}` : "baro";
    } else if (weather === TEMPERATURE) {
        url_weather_selection = url_code_flag === true ? `temperature/${code.value || tempCode}` : "temperature";
    }

    return `/${url_scope}/${url_weather_selection}?decode=true`;
};

export const extremeWeatherApi = createApi({
    reducerPath: "extremeWeatherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api.airportweather.org/v1/weather",
    }),
    endpoints(build) {
        return {
            fetchWeatherMetars: build.query({
                query: ({
                    scope,
                    weather,
                    code,
                    params,
                }) => {
                    const taggedUrl = generateURL(weather, scope, code);
                    return {
                        url: taggedUrl,
                        params,
                        method: "GET",
                    };
                },
            }),
        };
    },
});

export const { useFetchWeatherMetarsQuery } = extremeWeatherApi;
