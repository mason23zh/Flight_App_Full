import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";
import { extremeWeatherApi } from "./apis/extremeWeatherApi";
import { changeUserSelection, extremeWeatherReducer } from "./slices/extremeWeatherSlice";

export const store = configureStore({
    reducer: {
        extremeWeather: extremeWeatherReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(airportsApi.middleware)
        .concat(extremeWeatherApi.middleware),
});

setupListeners(store.dispatch);

export { useFetchAirportsWithGenericInputQuery, useFetchBasicAirportWithICAOQuery } from "./apis/airportsApi";
export { useFetchWeatherMetarsQuery } from "./apis/extremeWeatherApi";
export { changeUserSelection };
