import { MatchedFir } from "../../hooks/useMatchedFirs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchedFirSlice {
    matchedFirs: MatchedFir[] | [];
    hoveredFir: MatchedFir | null;
    isError: boolean;
}

const initialState: MatchedFirSlice = {
    matchedFirs: [],
    hoveredFir: null,
    isError: false,
};

const matchedFirSlice = createSlice({
    name: "matchedFirs",
    initialState,
    reducers: {
        setHoveredFir(state, action: PayloadAction<MatchedFir>) {
            state.hoveredFir = action.payload;
        },
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
        },
    },
});

export const { setMatchedFirs, setMatchedFirsError, resetMatchedFirs, setHoveredFir } =
    matchedFirSlice.actions;

export const matchedFirsReducer = matchedFirSlice.reducer;
