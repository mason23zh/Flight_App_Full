import { createSlice } from "@reduxjs/toolkit";
import { WIND_SPEED, GLOBAL } from "../../util/selection_names";

const extremeWeatherSlice = createSlice({
    name: "extremeWeather",
    initialState: {
        userSelection: {
            weather: WIND_SPEED,
            scope: GLOBAL,
            code: "",
        },
    },
    reducers: {
        changeUserSelection(state, action) {
            state.userSelection = action.payload;
        },
    },
});

export const { changeUserSelection } = extremeWeatherSlice.actions;
export const extremeWeatherReducer = extremeWeatherSlice.reducer;
