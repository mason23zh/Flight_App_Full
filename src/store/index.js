import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";
import { extremeWeatherApi } from "./apis/extremeWeatherApi";
import { metarApi } from "./apis/metarApi";
import { changeUserSelection, extremeWeatherReducer } from "./slices/extremeWeatherSlice";
import { weatherApi } from "./apis/weatherApi";

export const store = configureStore({
    reducer: {
        extremeWeather: extremeWeatherReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
        [metarApi.reducerPath]: metarApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(airportsApi.middleware)
        .concat(extremeWeatherApi.middleware)
        .concat(metarApi.middleware),
    
});

setupListeners(store.dispatch);

export { useFetchAirportsWithGenericInputQuery, useFetchBasicAirportWithICAOQuery } from "./apis/airportsApi";
export { useFetchWeatherMetarsQuery } from "./apis/extremeWeatherApi";
export { useFetchGenericWeatherQuery } from "./apis/weatherApi";
export { useFetchMetarByICAOQuery } from "./apis/metarApi";
export { changeUserSelection };
