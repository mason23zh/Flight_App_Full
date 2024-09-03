import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
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
import { setMapSearchSelectedTraffic, mapSearchTrafficReducer } from "./slices/mapSearchTrafficSlice";
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
    toggleAirportLabel,
    toggleSatelliteLayer,
    toggleMapRoadLabel,
    toggleMapStyleButton,
    toggleMapFilterButton,
    toggleTerrainLabel,
    toggleUnderlineFirBoundaries,
    toggleDayNightTerminator,
    toggleAirportVisible,
    switchMapStyles,
    toggleMovingMap,
    toggleTelemetry,
    toggleMapFollowTraffic,
    setLiveTrafficAvailable,
    resetMap
} from "./slices/vatsimMapVisibleSlice";

import {
    addMessage,
    removeMessage,
    removeMessageByContent,
    removeMessageByLocation,
    vatsimMapErrorReducer
} from "./slices/vatsimMapErrorSlice";
import {
    rehydrationCompleteReducer,
    setRehydrationComplete
} from "./slices/rehydrationCompleteSlice";
import {
    setSelectedTraffic,
    vatsimMapTrafficReducer
} from "./slices/vatsimMapTrafficSlice";
import {
    setMapSearchSelectedAirport,
    setAirportDepartureArrivalDisplay,
    setFilterAircraftOnMap_airport,
    mapSearchAirportReducer,
    setAirportTracking,
} from "./slices/mapSearchAirportSlice";

import {
    setTrafficTracking,
    flightInfoReducer
} from "./slices/flightInfoSlice";

import {
    setSearchInput,
    setTabSelection,
    mapSearchBoxReducer
} from "./slices/mapSearchBoxSlice";

import {
    setMapSearchSelectedAircraft,
    setAircraftListDisplay,
    mapSearchAircraftReducer,
    setFilterAircraftOnMap_aircraft,
    setSelectedAircraftCategory
} from "./slices/mapSearchAircraftSlice";

import {
    openSearchResults,
    openTrafficDetail,
    closeTrafficDetail,
    closeSearchResults,
    mapDisplayPanelReducer
} from "./slices/mapDisplayPanelSlice";

import {
    setSelectedAirportICAO,
    airportSelectionReducer
} from "./slices/airportSelectionSlice";

import {
    setMatchedFirsError,
    setMatchedFirs,
    setHoveredFir,
    matchedFirsReducer
} from "./slices/matchedFirSlice";

import {
    setMatchedTracons,
    setMatchedFallbackTracons,
    setFallbackGeoJson,
    setHoveredTracon,
    setMatchedTraconError,
    setMatchedTraconLoading,
    matchedTraconsReducer
} from "./slices/matchedTraconSlice";


/*
The persisConfig is used to store the map selection option in the localStorage
This is the config for redux-persist lib
* */
const persistConfig = {
    key: "mapSelection",
    version: 1,
    storage,
};

/*
The persisted reducer to store all the state inside into the localStorage
* */
const vatsimMapVisiblePersistedReducer = persistReducer(persistConfig, vatsimMapVisibleReducer);

export const store = configureStore({
    reducer: {
        vatsimEvent: vatsimEventReducer,
        extremeWeather: extremeWeatherReducer,
        vatsimMapEvent: vatsimMapEventReducer,
        vatsimMapVisible: vatsimMapVisiblePersistedReducer, // replace the original reducer with the persisted reducer
        vatsimMapError: vatsimMapErrorReducer,
        rehydrationComplete: rehydrationCompleteReducer,
        vatsimMapTraffic: vatsimMapTrafficReducer,
        mapSearchTraffic: mapSearchTrafficReducer,
        mapSearchAirport: mapSearchAirportReducer,
        mapSearchAircraft: mapSearchAircraftReducer,
        mapSearchBox: mapSearchBoxReducer,
        mapDisplayPanel: mapDisplayPanelReducer,
        flightInfo: flightInfoReducer,
        airportSelection: airportSelectionReducer,
        matchedFirs: matchedFirsReducer,
        matchedTracons: matchedTraconsReducer,
        [airportsApi.reducerPath]: airportsApi.reducer,
        [extremeWeatherApi.reducerPath]: extremeWeatherApi.reducer,
        [metarApi.reducerPath]: metarApi.reducer,
        [weatherApi.reducerPath]: weatherApi.reducer,
        [tafApi.reducerPath]: tafApi.reducer,
        [vatsimApi.reducerPath]: vatsimApi.reducer,
        [vatsimDataApi.reducerPath]: vatsimDataApi.reducer,
        [rainviewerApi.reducerPath]: rainviewerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    })
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
    useFetchTrafficTrackDataQuery,
    useFetchVatsimTrafficByCallsignQuery
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
    toggleAirportLabel,
    toggleSatelliteLayer,
    toggleMapRoadLabel,
    toggleMapFilterButton,
    toggleMapStyleButton,
    toggleTerrainLabel,
    toggleUnderlineFirBoundaries,
    toggleDayNightTerminator,
    toggleAirportVisible,
    switchMapStyles,
    toggleMovingMap,
    toggleTelemetry,
    toggleMapFollowTraffic,
    setLiveTrafficAvailable,
    resetMap
};

export {
    addMessage,
    removeMessage,
    removeMessageByContent,
    removeMessageByLocation,
};

export {
    setRehydrationComplete
};

export { setSelectedTraffic };

export { setMapSearchSelectedTraffic };

export {
    setMapSearchSelectedAirport,
    setAirportDepartureArrivalDisplay,
    setFilterAircraftOnMap_airport,
    setAirportTracking
};

export { setTrafficTracking };

export { setSearchInput, setTabSelection };

export {
    setMapSearchSelectedAircraft,
    setAircraftListDisplay,
    setFilterAircraftOnMap_aircraft,
    setSelectedAircraftCategory
};

export {
    openSearchResults,
    openTrafficDetail,
    closeTrafficDetail,
    closeSearchResults
};

export {
    setMatchedTraconLoading,
    setMatchedFallbackTracons,
    setFallbackGeoJson,
    setHoveredTracon,
    setMatchedTracons,
    setMatchedTraconError
};

export {
    setMatchedFirs,
    setHoveredFir,
    setMatchedFirsError
};

export {
    setSelectedAirportICAO
};

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>  