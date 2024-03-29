import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";
import { extremeWeatherApi } from "./apis/extremeWeatherApi";
import { metarApi } from "./apis/metarApi";
import { weatherApi } from "./apis/weatherApi";
import { tafApi } from "./apis/tafApi";
import { vatsimApi } from "./apis/vatsimApi";
import { changeUserSelection, extremeWeatherReducer } from "./slices/extremeWeatherSlice";
import { changeUserSelectionVatsimEvent, vatsimEventReducer } from "./slices/vatsimEventSlice";

export const store = configureStore({
    reducer: {
        vatsimEvent: vatsimEventReducer,
        extremeWeather: extremeWeatherReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
        [metarApi.reducerPath]: metarApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [tafApi.reducerPath]: tafApi.reducer,
        [vatsimApi.reducerPath]: vatsimApi.reducer,
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(airportsApi.middleware)
        .concat(extremeWeatherApi.middleware)
        .concat(metarApi.middleware)
        .concat(weatherApi.middleware)
        .concat(tafApi.middleware)
        .concat(vatsimApi.middleware),
    
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
export { useFetchCurrentVatsimEventsQuery, useFetchSortedVatsimEventsQuery } from "./apis/vatsimApi";
export { changeUserSelection, changeUserSelectionVatsimEvent };
