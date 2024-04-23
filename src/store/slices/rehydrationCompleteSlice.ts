import { createSlice } from "@reduxjs/toolkit";

const rehydrationCompleteSlice = createSlice({
    name: "rehydrationComplete",
    initialState: {
        isComplete: false,
    },
    reducers: {
        setRehydrationComplete(state) {
            state.isComplete = true;
        }
    }
});

export const { setRehydrationComplete } = rehydrationCompleteSlice.actions;
export const rehydrationCompleteReducer = rehydrationCompleteSlice.reducer;