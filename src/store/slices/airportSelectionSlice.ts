import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AirportSelectionSlice {
    airportICAO: string | null;
}

const initialState: AirportSelectionSlice = {
    airportICAO: null,
};

const airportSelectionSlice = createSlice({
    name: "airportSelection",
    initialState,
    reducers: {
        setSelectedAirportICAO(state, action: PayloadAction<string | null>) {
            state.airportICAO = action.payload;
        }
    }
});

export const { setSelectedAirportICAO } = airportSelectionSlice.actions;
export const airportSelectionReducer = airportSelectionSlice.reducer;