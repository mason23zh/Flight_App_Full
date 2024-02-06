import { createSlice } from "@reduxjs/toolkit";

const vatsimMapVisibleSlice = createSlice({
    name: "vatsimMapVisible",
    initialState: {
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
    },

    reducers: {
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
        toggleMapLabel(state, action) {
            state.mapLabelVisible = action.payload;
        }
    }
});

export const {
    toggleControllerLayer,
    toggleTraconLabel,
    toggleAtcLayer,
    toggleTrafficLayer,
    toggleWeatherRasterLayer,
    toggleMapLabel,
    toggleSatelliteLayer
} = vatsimMapVisibleSlice.actions;
export const vatsimMapVisibleReducer = vatsimMapVisibleSlice.reducer;