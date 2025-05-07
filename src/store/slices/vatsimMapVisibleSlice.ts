import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VatsimMapVisibleState } from "../../types";

interface MapStylePayloadAction {
    payload: {
        mapStyles: "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"
    };
}

const initialState: VatsimMapVisibleState = {
    allAtcLayerVisible: true,
    controllerLayerVisible: true,
    controllerMarkerVisible: true,
    traconLabelVisible: true,
    firLabelVisible: true,
    underlineFirBoundaries: true,
    mapRoadVisible: false,
    trackLayerVisible: false,
    trafficLayerVisible: true,
    mapLabelVisible: true,
    airportLabelVisible: false,
    airportVisible: true,
    satelliteLayerVisible: false,
    weatherRasterVisible: false,
    mapStyleButtonToggle: false,
    mapFilterButtonToggle: false,
    terrainEnable: false,
    dayNightTerminator: false,
    liveTrafficAvailable: false,
    movingMap: false,
    mapFollowTraffic: false,
    displayTelemetry: false,
    searchBoxVisible: false,
    featuredAirportsVisible: false,
    mapProjection: "mercator",
    mapStyles: "MONO_DARK"
};

const vatsimMapVisibleSlice = createSlice({
    name: "vatsimMapVisible",
    initialState,
    reducers: {
        resetMap(state) {
            state.allAtcLayerVisible = true;
            state.controllerLayerVisible = true;
            state.controllerMarkerVisible = true;
            state.traconLabelVisible = true;
            state.firLabelVisible = true;
            state.underlineFirBoundaries = true;
            state.mapRoadVisible = false;
            state.trackLayerVisible = false;
            state.trafficLayerVisible = true;
            state.mapLabelVisible = true;
            state.airportLabelVisible = false;
            state.airportVisible = true;
            state.satelliteLayerVisible = false;
            state.weatherRasterVisible = false;
            state.mapStyleButtonToggle = false;
            state.mapFilterButtonToggle = true;
            state.terrainEnable = false;
            state.dayNightTerminator = false;
            state.movingMap = false;
            state.mapFollowTraffic = false;
            state.displayTelemetry = false;
            state.searchBoxVisible = false;
            state.featuredAirportsVisible = false;

            state.mapStyles = "MONO_DARK";
        },
        switchMapStyles(state, action: MapStylePayloadAction) {
            state.mapStyles = action.payload.mapStyles;
        },
        toggleSatelliteLayer(state, action) {
            state.satelliteLayerVisible = action.payload;
        },
        toggleControllerLayer(state, action) {
            state.controllerLayerVisible = action.payload;
            state.controllerMarkerVisible = action.payload;
        },
        toggleTraconLabel(state, action) {
            state.traconLabelVisible = action.payload;
        },
        toggleAtcLayer(state) {
            state.allAtcLayerVisible = !state.allAtcLayerVisible;
        },
        toggleTrafficLayer(state) {
            state.trafficLayerVisible = !state.trafficLayerVisible;
        },
        toggleWeatherRasterLayer(state) {
            state.weatherRasterVisible = !state.weatherRasterVisible;
        },
        toggleTerrainLabel(state) {
            // state.terrainEnable = action.payload;
            state.terrainEnable = !state.terrainEnable;
        },
        setLiveTrafficAvailable(state, action) {
            state.liveTrafficAvailable = action.payload;
        },
        toggleMovingMap(state, action) {
            state.movingMap = action.payload;
        },
        toggleTelemetry(state, action) {
            if (!state.movingMap && state.displayTelemetry) {
                state.displayTelemetry = false;
            }
            state.displayTelemetry = action.payload;
        },
        toggleMapFollowTraffic(state, action) {
            state.mapFollowTraffic = action.payload;
        },
        toggleMapLabel(state) {
            // state.mapLabelVisible = action.payload;
            state.mapLabelVisible = !state.mapLabelVisible;
        },
        toggleAirportVisible(state, action) {
            state.airportVisible = action.payload;
            if (!state.airportVisible && state.airportLabelVisible) {
                state.airportLabelVisible = false;
            }
        },
        toggleAirportLabel(state, action) {
            state.airportLabelVisible = action.payload;
        },
        toggleMapRoadLabel(state) {
            // state.mapRoadVisible = action.payload;
            state.mapRoadVisible = !state.mapRoadVisible;
        },
        toggleUnderlineFirBoundaries(state, action) {
            state.underlineFirBoundaries = action.payload;
        },
        toggleDayNightTerminator(state, action) {
            state.dayNightTerminator = action.payload;
        },
        toggleMapStyleButton(state, action) {
            state.mapStyleButtonToggle = action.payload;
            if (action.payload) {
                state.mapFilterButtonToggle = false;
                state.searchBoxVisible = false;
                state.featuredAirportsVisible = false;
            }
        },
        toggleMapFilterButton(state, action) {
            state.mapFilterButtonToggle = action.payload;
            if (action.payload) {
                state.mapStyleButtonToggle = false;
                state.searchBoxVisible = false;
                state.featuredAirportsVisible = false;
            }
        },
        toggleSearchBox(state, action) {
            state.searchBoxVisible = action.payload;
            if (action.payload) {
                state.mapStyleButtonToggle = false;
                state.mapFilterButtonToggle = false;
                state.featuredAirportsVisible = false;
            }
        },
        toggleFeaturedAirports(state, action) {
            state.featuredAirportsVisible = action.payload;
            if (action.payload) {
                state.mapFilterButtonToggle = false;
                state.searchBoxVisible = false;
                state.mapStyleButtonToggle = false;
            }
        },
        setMapProjection(state, action: PayloadAction<"globe" | "mercator">) {
            state.mapProjection = action.payload;
        }
    }
});

export const {
    toggleMapStyleButton,
    toggleMapFilterButton,
    toggleControllerLayer,
    toggleTraconLabel,
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer,
    toggleMapLabel,
    toggleAirportLabel,
    toggleSatelliteLayer,
    toggleMapRoadLabel,
    switchMapStyles,
    toggleTerrainLabel,
    toggleUnderlineFirBoundaries,
    toggleDayNightTerminator,
    toggleAirportVisible,
    toggleMovingMap,
    toggleTelemetry,
    toggleMapFollowTraffic,
    setLiveTrafficAvailable,
    resetMap,
    toggleSearchBox,
    toggleFeaturedAirports,
    setMapProjection
} = vatsimMapVisibleSlice.actions;
export const vatsimMapVisibleReducer = vatsimMapVisibleSlice.reducer;