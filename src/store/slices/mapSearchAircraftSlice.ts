import { VatsimFlight } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchAircraftSlice {
    selectedAircraftType: VatsimFlight[] | null;
    aircraftListDisplay: boolean;
    filterAircraftOnMap: boolean;
    selectedAircraftCategory: string;
}

const initialState: MapSearchAircraftSlice = {
    selectedAircraftType: null,
    aircraftListDisplay: false,
    filterAircraftOnMap: false,
    selectedAircraftCategory: "",
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
        setFilterAircraftOnMap_aircraft(state, action: PayloadAction<boolean>) {
            state.filterAircraftOnMap = action.payload;
        },
        setSelectedAircraftCategory(state, action: PayloadAction<string>) {
            state.selectedAircraftCategory = action.payload;
        },
    },
});

export const {
    setMapSearchSelectedAircraft,
    setAircraftListDisplay,
    setFilterAircraftOnMap_aircraft,
    setSelectedAircraftCategory,
} = mapSearchAircraftSlice.actions;
export const mapSearchAircraftReducer = mapSearchAircraftSlice.reducer;
