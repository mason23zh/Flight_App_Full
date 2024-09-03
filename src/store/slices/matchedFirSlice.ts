import { MatchedFir } from "../../hooks/useMatchedFirs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchedFirSlice {
    matchedFirs: MatchedFir[] | [];
    isError: boolean;
}

const initialState: MatchedFirSlice = {
    matchedFirs: [],
    isError: false
};

const matchedFirSlice = createSlice({
    name: "matchedFirs",
    initialState,
    reducers: {
        setMatchedFirs(state, action: PayloadAction<MatchedFir[]>) {
            state.matchedFirs = action.payload;
            state.isError = false;
        },
        setMatchedFirsError(state, action: PayloadAction<boolean>) {
            if (action.payload) {
                state.matchedFirs = [];
                state.isError = true;
            }
        },
        resetMatchedFirs(state) {
            state.matchedFirs = [];
            state.isError = false;
        }
    }
});

export const {
    setMatchedFirs,
    setMatchedFirsError,
    resetMatchedFirs
} = matchedFirSlice.actions;

export const matchedFirsReducer = matchedFirSlice.reducer;