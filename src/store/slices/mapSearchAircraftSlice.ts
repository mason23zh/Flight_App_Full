import { VatsimFlight } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchAircraftSlice {
    selectedAircraftType: VatsimFlight[] | null;
}

const initialState: MapSearchAircraftSlice = {
    selectedAircraftType: null,
};

const mapSearchAircraftSlice = createSlice({
    name: "mapSearchAircraft",
    initialState,
    reducers: {
        setMapSearchSelectedAircraft(state, action: PayloadAction<VatsimFlight[]>) {
            state.selectedAircraftType = action.payload;
        }
    }
});

export const {
    setMapSearchSelectedAircraft
} = mapSearchAircraftSlice.actions;
export const mapSearchAircraftReducer = mapSearchAircraftSlice.reducer;