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
    mapRoadVisible: false,
    trackLayerVisible: false,
    trafficLayerVisible: true,
    mapLabelVisible: true,
    satelliteLayerVisible: false,
    weatherRasterVisible: false,
    mapStyleButtonToggle: false,
    mapFilterButtonToggle: false,
    terrainEnable: false,
    mapStyles: "DEFAULT"
};

const vatsimMapVisibleSlice = createSlice({
    name: "vatsimMapVisible",
    initialState,
    reducers: {
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
        toggleMapLabel(state, action) {
            state.mapLabelVisible = action.payload;
        },
        toggleMapRoadLabel(state, action) {
            state.mapRoadVisible = action.payload;
        },
        toggleMapStyleButton(state, action) {
            state.mapStyleButtonToggle = action.payload;
            if (action.payload && state.mapFilterButtonToggle) {
                state.mapFilterButtonToggle = false;
            }
        },
        toggleMapFilterButton(state, action) {
            state.mapFilterButtonToggle = action.payload;
            if (action.payload && state.mapStyleButtonToggle) {
                state.mapStyleButtonToggle = false;
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
    toggleSatelliteLayer,
    toggleMapRoadLabel,
    switchMapStyles,
    toggleTerrainLabel
} = vatsimMapVisibleSlice.actions;
export const vatsimMapVisibleReducer = vatsimMapVisibleSlice.reducer;