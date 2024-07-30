import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PanelState {
    activePanel: "searchResults" | "trafficDetail" | null;
    searchResultsType: "AIRCRAFT" | "AIRPORT" | "TRAFFIC" | null;
}

interface StackState {
    panelStack: PanelState[];
    currentPanel: PanelState;
}

const initialState: StackState = {
    panelStack: [],
    currentPanel: {
        activePanel: null,
        searchResultsType: null
    }
};

const mapDisplayPanelSlice = createSlice({
    name: "mapDisplayPanel",
    initialState,
    reducers: {
        openSearchResults: (state, action: PayloadAction<"AIRCRAFT" | "AIRPORT" | "TRAFFIC">) => {
            state.panelStack.push(state.currentPanel);
            state.currentPanel = {
                activePanel: "searchResults",
                searchResultsType: action.payload,
            };
        },
        openTrafficDetail: (state) => {
            state.panelStack.push(state.currentPanel);
            state.currentPanel = {
                activePanel: "trafficDetail",
                searchResultsType: state.currentPanel.searchResultsType,
            };
        },
        closeCurrentPanel: (state) => {
            if (state.panelStack.length > 0) {
                state.currentPanel = state.panelStack.pop() || null;
            } else {
                state.currentPanel = {
                    activePanel: null,
                    searchResultsType: null,
                };
            }
        },
        closeSearchResults: (state) => {
            state.currentPanel = null;
            state.panelStack = [];
        }
    }
});

export const {
    openSearchResults,
    openTrafficDetail,
    closeCurrentPanel,
    closeSearchResults
} = mapDisplayPanelSlice.actions;
export const mapDisplayPanelReducer = mapDisplayPanelSlice.reducer;