import { FallbackTracon, MatchedTracon } from "../../hooks/useMatchTracon";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoJSON } from "geojson";
import { HoverTracon } from "../../component/map/mapbox_Layer/Tracon_Layers/TraconLabelPopup";

interface MatchedTraconsSlice {
    matchedTracons: MatchedTracon[] | [];
    matchedFallbackTracons: FallbackTracon[] | [];
    fallbackGeoJson: GeoJSON.FeatureCollection | null;
    hoveredTracon: HoverTracon | null;
    isLoading: boolean;
    isError: boolean;
}

const initialState: MatchedTraconsSlice = {
    matchedTracons: [],
    matchedFallbackTracons: [],
    hoveredTracon: null,
    fallbackGeoJson: null,
    isLoading: false,
    isError: false,
};

const matchedTraconSlice = createSlice({
    name: "matchedTracons",
    initialState,
    reducers: {
        setHoveredTracon: (state, action: PayloadAction<HoverTracon>) => {
            state.hoveredTracon = action.payload;
        },
        setMatchedTracons: (state, action: PayloadAction<MatchedTracon[]>) => {
            state.matchedTracons = action.payload;
            state.isError = false;
        },
        setMatchedFallbackTracons: (state, action: PayloadAction<FallbackTracon[]>) => {
            state.matchedFallbackTracons = action.payload;
        },
        setFallbackGeoJson: (state, action: PayloadAction<GeoJSON.FeatureCollection>) => {
            state.fallbackGeoJson = action.payload;
        },
        setMatchedTraconError: (state, action: PayloadAction<boolean>) => {
            if (action.payload) {
                state.isError = action.payload;
                state.matchedTracons = [];
                state.matchedFallbackTracons = [];
                state.fallbackGeoJson = null;
            }
        },
        setMatchedTraconLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    setMatchedTracons,
    setMatchedFallbackTracons,
    setFallbackGeoJson,
    setHoveredTracon,
    setMatchedTraconError,
    setMatchedTraconLoading,
} = matchedTraconSlice.actions;

export const matchedTraconsReducer = matchedTraconSlice.reducer;
