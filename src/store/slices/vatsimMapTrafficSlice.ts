import { createSlice } from "@reduxjs/toolkit";
import { VatsimFlight } from "../../types";

interface InitialState {
    selectedTraffic: VatsimFlight | null;
}

interface SetSelectedTrafficAction {
    payload: VatsimFlight;
}

const initialState: InitialState = {
    selectedTraffic: {
        altitude: 0,
        callsign: "",
        cid: 0,
        groundspeed: 0,
        heading: 0,
        last_updated: "",
        latitude: 0,
        logon_time: "",
        longitude: 0,
        military_rating: 0,
        name: "",
        pilot_rating: 0,
        qnh_i_hg: 0,
        qnh_mb: 0,
        server: "",
        transponder: "",
        flight_plan: {
            flight_rules: "",
            aircraft: "",
            aircraft_faa: "",
            aircraft_short: "",
            alternate: "",
            altitude: "",
            arrival: "",
            assigned_transponder: "",
            cruise_tas: "",
            departure: "",
            deptime: "",
            enroute_time: "",
            fuel_time: "",
            remarks: "",
            revision_id: 0,
            route: "",
        },
    },
};

const vatsimMapTrafficSlice = createSlice({
    name: "vatsimMapTraffic",
    initialState,
    reducers: {
        setSelectedTraffic(state, action: SetSelectedTrafficAction) {
            state.selectedTraffic = action.payload;
        },
    },
});

export const { setSelectedTraffic } = vatsimMapTrafficSlice.actions;
export const vatsimMapTrafficReducer = vatsimMapTrafficSlice.reducer;
