import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalDbAirport } from "../../types";

interface MapSearchAirportSlice {
    selectedAirport: LocalDbAirport | null;
    airportDepartureArrivalDisplay: boolean;
    filterAircraftOnMap: boolean;
    tracking: boolean;
}

const initialState: MapSearchAirportSlice = {
    selectedAirport: null,
    airportDepartureArrivalDisplay: false,
    filterAircraftOnMap: false,
    tracking: false,
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
        },
        setFilterAircraftOnMap_airport(state, action: PayloadAction<boolean>) {
            state.filterAircraftOnMap = action.payload;
        },
        setAirportTracking(state, action: PayloadAction<boolean>) {
            state.tracking = action.payload;
        }
    }
});

export const {
    setMapSearchSelectedAirport,
    setAirportDepartureArrivalDisplay,
    setFilterAircraftOnMap_airport,
    setAirportTracking
} = mapSearchAirportSlice.actions;
export const mapSearchAirportReducer = mapSearchAirportSlice.reducer;