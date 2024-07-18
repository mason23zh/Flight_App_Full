import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlightInfoSlice {
    tracking: boolean;
}

const initialState: FlightInfoSlice = {
    tracking: false
};

const flightInfoSlice = createSlice({
    name: "flightInfo",
    initialState,
    reducers: {
        setTrafficTracking(state, action: PayloadAction<boolean>) {
            state.tracking = action.payload;
        }
    }
});

export const { setTrafficTracking } = flightInfoSlice.actions;

export const flightInfoReducer = flightInfoSlice.reducer;