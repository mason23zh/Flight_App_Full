import { createSlice } from "@reduxjs/toolkit";

interface MapStylePayloadAction {
    payload: {
        mapStyle: "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"
    };
}

const vatsimMapStyleSlice = createSlice({
    name: "vatsimMapStyle",
    initialState: {
        mapStyle: "DEFAULT"
    },

    reducers: {
        switchMapStyle(state, action: MapStylePayloadAction) {
            state.mapStyle = action.payload.mapStyle;
        }
    }
});

export const { switchMapStyle } = vatsimMapStyleSlice.actions;
export const vatsimMapStyleReducer = vatsimMapStyleSlice.reducer;