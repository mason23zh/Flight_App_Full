import { VatsimFlight } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchAircraftSlice {
    selectedAircraftType: VatsimFlight[] | null;
    aircraftListDisplay: boolean;
}

const initialState: MapSearchAircraftSlice = {
    selectedAircraftType: null,
    aircraftListDisplay: false,
};

const mapSearchAircraftSlice = createSlice({
    name: "mapSearchAircraft",
    initialState,
    reducers: {
        setMapSearchSelectedAircraft(state, action: PayloadAction<VatsimFlight[]>) {
            state.selectedAircraftType = action.payload;
        },
        setAircraftListDisplay(state, action: PayloadAction<boolean>) {
            state.aircraftListDisplay = action.payload;
        }
    }
});

export const {
    setMapSearchSelectedAircraft,
    setAircraftListDisplay
} = mapSearchAircraftSlice.actions;
export const mapSearchAircraftReducer = mapSearchAircraftSlice.reducer;