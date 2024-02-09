import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { airportsApi } from "./apis/airportsApi";
import { vatsimDataApi } from "./apis/vatsimDataApi";
import { extremeWeatherApi } from "./apis/extremeWeatherApi";
import { metarApi } from "./apis/metarApi";
import { weatherApi } from "./apis/weatherApi";
import { tafApi } from "./apis/tafApi";
import { vatsimApi } from "./apis/vatsimApi";
import { rainviewerApi } from "./apis/rainviewerApi";
import { changeUserSelection, extremeWeatherReducer } from "./slices/extremeWeatherSlice";
import { changeUserSelectionVatsimEvent, vatsimEventReducer } from "./slices/vatsimEventSlice";
import {
    onMouseHoverFirLabel,
    onMouseLeaveFirLabel,
    onMouseHoverTraconLabel,
    onMouseLeaveTraconLabel,
    onMouseHoverControllerLabel,
    onMouseLeaveControllerLabel, vatsimMapEventReducer
} from "./slices/vatsimMapMouseEventSlice";
import {
    toggleControllerLayer,
    toggleTraconLabel,
    vatsimMapVisibleReducer,
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer,
    toggleMapLabel,
    toggleSatelliteLayer,
    toggleMapRoadLabel
} from "./slices/vatsimMapVisibleSlice";

import {
    addMessage,
    removeMessage,
    removeMessageByContent,
    removeMessageByLocation,
    vatsimMapErrorReducer
} from "./slices/vatsimMapErrorSlice";

export const store = configureStore({
    reducer: {
        vatsimEvent: vatsimEventReducer,
        extremeWeather: extremeWeatherReducer,
        vatsimMapEvent: vatsimMapEventReducer,
        vatsimMapVisible: vatsimMapVisibleReducer,
        vatsimMapError: vatsimMapErrorReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
        [metarApi.reducerPath]: metarApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [tafApi.reducerPath]: tafApi.reducer,
        [vatsimApi.reducerPath]: vatsimApi.reducer,
        [vatsimDataApi.reducerPath]: vatsimDataApi.reducer,
        [rainviewerApi.reducerPath]: rainviewerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(airportsApi.middleware)
        .concat(extremeWeatherApi.middleware)
        .concat(metarApi.middleware)
        .concat(weatherApi.middleware)
        .concat(tafApi.middleware)
        .concat(vatsimApi.middleware)
        .concat(vatsimDataApi.middleware)
        .concat(rainviewerApi.middleware)

});

setupListeners(store.dispatch);

export {
    useFetchAirportsWithGenericInputQuery,
    useFetchBasicAirportWithICAOQuery,
    useFetchDetailAirportWithICAOQuery,
    useFetchDetailAirportWithICAO_WidgetQuery,
    useFetchMostPopularAirportsQuery,
    useFetchVatsimPopularAirportsQuery,
} from "./apis/airportsApi";
export { useFetchTafByICAOQuery } from "./apis/tafApi";
export { useFetchWeatherMetarsQuery } from "./apis/extremeWeatherApi";
export { useFetchGenericWeatherQuery } from "./apis/weatherApi";
export { useFetchMetarByICAOQuery, useFetchMetarByGenericInputQuery } from "./apis/metarApi";
export {
    useFetchCurrentVatsimEventsQuery,
    useFetchSortedVatsimEventsQuery,
    useFetchVatsimControllersDataQuery,
    useFetchVatsimPilotsDataQuery,
    useFetchTrafficTrackDataQuery
} from "./apis/vatsimApi";
export {
    useFetchVatsimFirBoundariesQuery,
    useFetchVatsimFirQuery,
    useFetchVatsimFssQuery,
    useFetchVatsimTraconBoundariesQuery
} from "./apis/vatsimDataApi";
export { useFetchRainviewerTimeStampsQuery } from "./apis/rainviewerApi";
export { changeUserSelection, changeUserSelectionVatsimEvent };
export {
    onMouseHoverFirLabel,
    onMouseLeaveFirLabel,
    onMouseHoverTraconLabel,
    onMouseLeaveTraconLabel,
    onMouseHoverControllerLabel,
    onMouseLeaveControllerLabel
};
export {
    toggleTraconLabel,
    toggleControllerLayer,
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer,
    toggleMapLabel,
    toggleSatelliteLayer,
    toggleMapRoadLabel
};

export {
    addMessage,
    removeMessage,
    removeMessageByContent,
    removeMessageByLocation,
};

export type RootState = ReturnType<typeof store.getState> 