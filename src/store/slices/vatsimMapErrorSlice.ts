import { createSlice } from "@reduxjs/toolkit";

interface AddMessagePayloadAction {
    type: "vatsimMapError/addMessage";
    payload: {
        location: "NXRAD" | "ATC" | "BASE_TRAFFIC" | "FIR" | "TRACON" | "CONTROLLER" | "TRAFFIC_TRACK" | "BASE_MAP";
        messageType: "LOADING" | "ERROR";
        content: string;
    };
}

interface RemoveMessagePayloadAction {
    type: "vatsimMapError/removeMessageByLocation",
    payload: {
        location: "NXRAD" | "ATC" | "BASE_TRAFFIC" | "FIR" | "TRACON" | "CONTROLLER" | "TRAFFIC_TRACK" | "BASE_MAP";
        // content: string;
    }
}

const vatsimMapErrorSlice = createSlice({
    name: "vatsimMapError",
    initialState: {
        messages: []
    },

    reducers: {
        addMessage(state, action: AddMessagePayloadAction) {
            const found = state.messages.find((msg) => msg.payload.content === action.payload.content);
            if (!found) {
                state.messages.push(action);
            }
        },
        removeMessageByLocation(state, action: RemoveMessagePayloadAction) {
            state.messages = state.messages.filter((msg) =>
                msg.payload.location !== action.payload.location &&
                    msg.payload.messageType === "ERROR"
            );
        },
        removeMessage(state, action) {
            state.messages = state.messages.filter((message, index) => index !== action.payload);
        },
        removeMessageByContent(state, action) {
            state.messages = state.messages.filter((message) => message !== action.payload);
        }
    }
});

export const {
    addMessage,
    removeMessage,
    removeMessageByContent,
    removeMessageByLocation
} = vatsimMapErrorSlice.actions;

export const vatsimMapErrorReducer = vatsimMapErrorSlice.reducer;