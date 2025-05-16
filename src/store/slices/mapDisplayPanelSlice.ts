import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PanelState {
    activePanel: "searchResults" | "trafficDetail" | null;
    searchResultsType: "AIRCRAFT" | "AIRPORT" | "TRAFFIC" | null;
    searchResultsVisible: boolean;
    trafficDetailVisible: boolean;
}

const initialState: PanelState = {
    activePanel: null,
    searchResultsType: null,
    searchResultsVisible: false,
    trafficDetailVisible: false,
};

const mapDisplayPanelSlice = createSlice({
    name: "mapDisplayPanel",
    initialState,
    reducers: {
        openSearchResults: (state, action: PayloadAction<"AIRCRAFT" | "AIRPORT" | "TRAFFIC">) => {
            // close the traffic detail if they are opened
            if (state.trafficDetailVisible) {
                state.trafficDetailVisible = false;
            }
            // set the search list results type to the current type
            if (state.searchResultsType !== action.payload) {
                state.searchResultsType = action.payload;
            }
            // open the search result list
            state.searchResultsVisible = true;
            // set the current active panel to search list result
            state.activePanel = "searchResults";
        },
        openTrafficDetail: (state) => {
            // close the search result list, but keep the searchResult type
            if (state.searchResultsVisible) {
                state.searchResultsVisible = false;
            }
            // set current active panel to traffic detail
            state.activePanel = "trafficDetail";
            // open the traffic detail panel
            state.trafficDetailVisible = true;
        },
        closeTrafficDetail: (state) => {
            // if no search result type available, this means user pick the traffic from un-filtered map
            // re-set everything
            if (!state.searchResultsType) {
                state.searchResultsVisible = false;
                state.trafficDetailVisible = false;
                state.activePanel = null;
            }
            // if search results type exist, this means user pick the traffic from the filtered map
            // we need to make search result list re-appear and close the traffic detail
            if (state.searchResultsType) {
                state.trafficDetailVisible = false;
                state.activePanel = "searchResults";
                state.searchResultsVisible = true;
            }
        },
        closeSearchResults: (state) => {
            // this will be only use for manually close the search results panel
            // re-set everything to default
            state.searchResultsVisible = false;
            state.trafficDetailVisible = false;
            state.searchResultsType = null;
            state.activePanel = null;
        },
    },
});

export const { openSearchResults, openTrafficDetail, closeTrafficDetail, closeSearchResults } =
    mapDisplayPanelSlice.actions;
export const mapDisplayPanelReducer = mapDisplayPanelSlice.reducer;
