import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//TODO: TypeScript
const mapLayerHoverSlice = createSlice({
    name: "mapLayerHover",
    initialState: {
        hoveredTraffic: null,
        hoveredController: null,
        hoveredFir: null,
        hoveredTracon: null
    },
    reducers: {
        setHoveredTraffic(state, action) {
            state.hoveredTraffic = action.payload;
        },
        setHoveredController(state, action) {
            state.hoveredController = action.payload;
        },
        setHoveredTracon(state, action) {
            state.hoveredTracon = action.payload;
        },
        setHoveredFir(state, action) {
            state.hoveredFir = action.payload;
        },
        clearHover(state) {
            state.hoveredTraffic = null;
            state.hoveredController = null;
            state.hoveredTracon = null;
            state.hoveredFir = null;
        }
    }
});

export const {
    setHoveredTraffic,
    setHoveredController,
    setHoveredFir,
    setHoveredTracon,
    clearHover
} = mapLayerHoverSlice.actions;
export const mapLayerHoverReducer = mapLayerHoverSlice.reducer;
