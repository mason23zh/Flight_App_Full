import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";
import { extremeWeatherApi } from "./apis/extremeWeatherApi";
import { metarApi } from "./apis/metarApi";
import { changeUserSelection, extremeWeatherReducer } from "./slices/extremeWeatherSlice";
import { weatherApi } from "./apis/weatherApi";
import { tafApi } from "./apis/tafApi";

export const store = configureStore({
    reducer: {
        extremeWeather: extremeWeatherReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
        [metarApi.reducerPath]: metarApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [tafApi.reducerPath]: tafApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(airportsApi.middleware)
        .concat(extremeWeatherApi.middleware)
        .concat(metarApi.middleware)
        .concat(weatherApi.middleware)
        .concat(tafApi.middleware),
    
});

setupListeners(store.dispatch);

export {
    useFetchAirportsWithGenericInputQuery,
    useFetchBasicAirportWithICAOQuery,
    useFetchDetailAirportWithICAO,
    useFetchDetailAirportWithICAO_WidgetQuery,
    useFetchMostPopularAirportsQuery,
    useFetchVatsimPopularAirportsQuery,
} from "./apis/airportsApi";
export { useFetchTafByICAOQuery } from "./apis/tafApi";
export { useFetchWeatherMetarsQuery } from "./apis/extremeWeatherApi";
export { useFetchGenericWeatherQuery } from "./apis/weatherApi";
export { useFetchMetarByICAOQuery, useFetchMetarByGenericInputQuery } from "./apis/metarApi";
export { changeUserSelection };
