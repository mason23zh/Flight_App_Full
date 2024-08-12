import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VatsimFlight } from "../../types";

interface MapSearchTrafficState {
    selectedTraffic: VatsimFlight | null;
}

const initialState: MapSearchTrafficState = {
    selectedTraffic: null
};

const mapSearchTrafficSlice = createSlice({
    name: "mapSearchTraffic",
    initialState,
    reducers: {
        setMapSearchSelectedTraffic(state, action: PayloadAction<VatsimFlight>) {
            state.selectedTraffic = action.payload;
        }
    }
});

export const { setMapSearchSelectedTraffic } = mapSearchTrafficSlice.actions;
export const mapSearchTrafficReducer = mapSearchTrafficSlice.reducer;