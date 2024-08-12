import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GLOBAL, WIND_SPEED } from "../../util/selection_names";

interface UserSelection {
    weather: string
    scope: string,
    code: object
}


const extremeWeatherSlice = createSlice({
    name: "extremeWeather",
    initialState: {
        userSelection: {
            weather: WIND_SPEED,
            scope: GLOBAL,
            code: {},
        },
    },
    reducers: {
        changeUserSelection(state, action: PayloadAction<UserSelection>) {
            state.userSelection = action.payload;
        },
    },
});

export const { changeUserSelection } = extremeWeatherSlice.actions;
export const extremeWeatherReducer = extremeWeatherSlice.reducer;
