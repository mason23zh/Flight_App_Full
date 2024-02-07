import { createSlice } from "@reduxjs/toolkit";

const vatsimMapMouseEventSlice = createSlice({
    name: "vatsimMapEvent",
    initialState: {
        userSelectionEvent: {
            type: "FeatureCollection",
            features: []
        }
    },

    reducers: {
        onMouseHoverFirLabel(state, action) {
            state.userSelectionEvent.features[0] = action.payload;
        },
        onMouseLeaveFirLabel(state, action) {
            state.userSelectionEvent = action.payload;
        },
        onMouseHoverTraconLabel(state, action) {
            state.userSelectionEvent = action.payload;
        },
        onMouseLeaveTraconLabel(state, action) {
            state.userSelectionEvent = action.payload;
        },
        onMouseHoverControllerLabel(state, action) {
            state.userSelectionEvent = action.payload;
        },
        onMouseLeaveControllerLabel(state, action) {
            state.userSelectionEvent = action.payload;
        }
    }
});

export const {
    onMouseHoverFirLabel,
    onMouseLeaveFirLabel,
    onMouseHoverTraconLabel,
    onMouseLeaveTraconLabel,
    onMouseHoverControllerLabel,
    onMouseLeaveControllerLabel
} = vatsimMapMouseEventSlice.actions;

export const vatsimMapEventReducer = vatsimMapMouseEventSlice.reducer;

