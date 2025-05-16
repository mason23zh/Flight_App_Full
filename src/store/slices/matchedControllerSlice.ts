import { AirportService } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchedControllerSlice {
    hoveredController: AirportService | null;
}

const initialState: MatchedControllerSlice = {
    hoveredController: null,
};

const matchedControllerSlice = createSlice({
    name: "matchedControllers",
    initialState,
    reducers: {
        setHoveredController(state, action: PayloadAction<AirportService>) {
            state.hoveredController = action.payload;
        },
    },
});

export const { setHoveredController } = matchedControllerSlice.actions;

export const matchedControllerReducer = matchedControllerSlice.reducer;
