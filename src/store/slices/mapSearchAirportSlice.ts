import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalDbAirport } from "../../types";

interface MapSearchAirportSlice {
    selectedAirport: LocalDbAirport | null;
}

const initialState: MapSearchAirportSlice = {
    selectedAirport: null
};

const mapSearchAirportSlice = createSlice({
    name: "mapSearchAirport",
    initialState,
    reducers: {
        setMapSearchSelectedAirport(state, action: PayloadAction<LocalDbAirport>) {
            state.selectedAirport = action.payload;
        }
    }
});

export const { setMapSearchSelectedAirport } = mapSearchAirportSlice.actions;
export const mapSearchAirportReducer = mapSearchAirportSlice.reducer;