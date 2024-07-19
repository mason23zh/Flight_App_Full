import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchBoxState {
    searchInput: string;
}

const initialState: MapSearchBoxState = {
    searchInput: ""
};

const mapSearchBoxSlice = createSlice({
    name: "mapSearchBox",
    initialState,
    reducers: {
        setSearchInput(state, action: PayloadAction<string>) {
            state.searchInput = action.payload;
        }
    }
});

export const { setSearchInput } = mapSearchBoxSlice.actions;
export const mapSearchBoxReducer = mapSearchBoxSlice.reducer;