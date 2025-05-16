import { createSlice } from "@reduxjs/toolkit";

const vatsimEventSlice = createSlice({
    name: "vatsimEvent",
    initialState: {
        userSelectionVatsimEvent: {},
    },
    reducers: {
        changeUserSelectionVatsimEvent(state, action) {
            // eslint-disable-next-line no-param-reassign
            state.userSelectionVatsimEvent = action.payload;
        },
    },
});

export const { changeUserSelectionVatsimEvent } = vatsimEventSlice.actions;
export const vatsimEventReducer = vatsimEventSlice.reducer;
