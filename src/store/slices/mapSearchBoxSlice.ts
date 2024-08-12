import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchBoxState {
    searchInput: string;
    tabSelection: string;
}

const initialState: MapSearchBoxState = {
    searchInput: "",
    tabSelection: "1"
};

const mapSearchBoxSlice = createSlice({
    name: "mapSearchBox",
    initialState,
    reducers: {
        setSearchInput(state, action: PayloadAction<string>) {
            state.searchInput = action.payload;
        },
        setTabSelection(state, action: PayloadAction<string>) {
            state.tabSelection = action.payload;
        }
    }
});

export const {
    setSearchInput,
    setTabSelection
} = mapSearchBoxSlice.actions;
export const mapSearchBoxReducer = mapSearchBoxSlice.reducer;