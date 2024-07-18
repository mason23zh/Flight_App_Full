import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalDbAirport } from "../../types";

interface MapSearchAirportSlice {
    selectedAirport: LocalDbAirport | null;
    airportDepartureArrivalDisplay: boolean;
}

const initialState: MapSearchAirportSlice = {
    selectedAirport: null,
    airportDepartureArrivalDisplay: false,
};

const mapSearchAirportSlice = createSlice({
    name: "mapSearchAirport",
    initialState,
    reducers: {
        setMapSearchSelectedAirport(state, action: PayloadAction<LocalDbAirport>) {
            state.selectedAirport = action.payload;
        },
        setAirportDepartureArrivalDisplay(state, action: PayloadAction<boolean>) {
            state.airportDepartureArrivalDisplay = action.payload;
        }
    }
});

export const {
    setMapSearchSelectedAirport,
    setAirportDepartureArrivalDisplay
} = mapSearchAirportSlice.actions;
export const mapSearchAirportReducer = mapSearchAirportSlice.reducer;