import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MapSearchBoxState {
    searchInput: string;
    tabSelection: "airports" | "flights" | "aircraft";
}

const initialState: MapSearchBoxState = {
    searchInput: "",
    tabSelection: "airports",
};

const mapSearchBoxSlice = createSlice({
    name: "mapSearchBox",
    initialState,
    reducers: {
        setSearchInput(state, action: PayloadAction<string>) {
            state.searchInput = action.payload;
        },
        setTabSelection(state, action: PayloadAction<"airports" | "flights" | "aircraft">) {
            state.tabSelection = action.payload;
        },
    },
});

export const { setSearchInput, setTabSelection } = mapSearchBoxSlice.actions;
export const mapSearchBoxReducer = mapSearchBoxSlice.reducer;
