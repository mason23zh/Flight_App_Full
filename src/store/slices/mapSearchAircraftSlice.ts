import { VatsimFlight } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchAircraftSlice {
    selectedAircraftType: VatsimFlight[] | null;
    aircraftListDisplay: boolean;
    filterAircraftOnMap: boolean;
}

const initialState: MapSearchAircraftSlice = {
    selectedAircraftType: null,
    aircraftListDisplay: false,
    filterAircraftOnMap: false,
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
        },
        setFilterAircraftOnMap(state, action: PayloadAction<boolean>) {
            state.filterAircraftOnMap = action.payload;
        }
    }
});

export const {
    setMapSearchSelectedAircraft,
    setAircraftListDisplay,
    setFilterAircraftOnMap
} = mapSearchAircraftSlice.actions;
export const mapSearchAircraftReducer = mapSearchAircraftSlice.reducer;