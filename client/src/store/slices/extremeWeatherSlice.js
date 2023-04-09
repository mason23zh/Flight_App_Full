import { createSlice } from "@reduxjs/toolkit";
import {
    WIND_GUST,
    WIND_SPEED,
    VISIBILITY,
    BARO,
    TEMPERATURE,
    GLOBAL,
    CONTINENT,
    COUNTRY,
} from "../../util/selection_names";

const extremeWeatherSlice = createSlice({
    name: "extremeWeather",
    initialState: {
        userSelection: {
            weather: WIND_SPEED,
            scope: GLOBAL,
            option: "",
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
