import { createSlice } from "@reduxjs/toolkit";
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
    mapStyles: "DEFAULT"
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

            state.mapStyles = "DEFAULT";
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
        toggleAtcLayer(state, action) {
            state.allAtcLayerVisible = action.payload;
        },
        toggleTrafficLayer(state, action) {
            state.trafficLayerVisible = action.payload;
        },
        toggleWeatherRasterLayer(state, action) {
            state.weatherRasterVisible = action.payload;
        },
        toggleTerrainLabel(state, action) {
            state.terrainEnable = action.payload;
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
        toggleMapLabel(state, action) {
            state.mapLabelVisible = action.payload;
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
        toggleMapRoadLabel(state, action) {
            state.mapRoadVisible = action.payload;
        },
        toggleUnderlineFirBoundaries(state, action) {
            state.underlineFirBoundaries = action.payload;
        },
        toggleDayNightTerminator(state, action) {
            state.dayNightTerminator = action.payload;
        },
        toggleMapStyleButton(state, action) {
            state.mapStyleButtonToggle = action.payload;
            if (action.payload && (state.mapFilterButtonToggle || state.searchBoxVisible)) {
                state.mapFilterButtonToggle = false;
                state.searchBoxVisible = false;
            }
        },
        toggleMapFilterButton(state, action) {
            state.mapFilterButtonToggle = action.payload;
            if (action.payload && (state.mapStyleButtonToggle || state.searchBoxVisible)) {
                state.mapStyleButtonToggle = false;
                state.searchBoxVisible = false;
            }
        },
        toggleSearchBox(state, action) {
            state.searchBoxVisible = action.payload;
            if (action.payload && (state.mapStyleButtonToggle || state.mapFilterButtonToggle)) {
                state.mapStyleButtonToggle = false;
                state.mapFilterButtonToggle = false;
            }
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
    toggleSearchBox
} = vatsimMapVisibleSlice.actions;
export const vatsimMapVisibleReducer = vatsimMapVisibleSlice.reducer;