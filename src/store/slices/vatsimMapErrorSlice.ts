import { createSlice } from "@reduxjs/toolkit";

const vatsimMapErrorSlice = createSlice({
    name: "vatsimMapError",
    initialState: {
        messages: [],
    },

    reducers: {
        addMessage(state, action) {
            if (!state.messages.includes(action.payload)) {
                state.messages.push(action.payload);
            }
        },
        removeMessage(state, action) {
            state.messages = state.messages.filter((message, index) => index !== action.payload);
        }
    }
});

export const {
    addMessage,
    removeMessage
} = vatsimMapErrorSlice.actions;

export const vatsimMapErrorReducer = vatsimMapErrorSlice.reducer;