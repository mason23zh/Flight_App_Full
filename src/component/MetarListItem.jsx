import React from "react";
import { useSelector } from "react-redux";
import ExpandablePanel from "./ExpandablePanel";
import {
    BARO, TEMPERATURE, VISIBILITY, WIND_GUST, WIND_SPEED,
} from "../util/selection_names";

function MetarListItem({ metar }) {
    const { weather } = useSelector((state) => state.extremeWeather.userSelection);

    let weatherSelection;
    if (weather === WIND_GUST) {
        weatherSelection = metar.wind_gust_kt;
    } else if (weather === WIND_SPEED) {
        weatherSelection = metar.wind_speed_kt;
    } else if (weather === VISIBILITY) {
        weatherSelection = metar.visibility_statute_mi;
    } else if (weather === BARO) {
        weatherSelection = metar.altim_in_hg;
    } else if (weather === TEMPERATURE) {
        weatherSelection = metar.temp_c;
    }
    return (
        <div>
            <ExpandablePanel metar={metar} weather={weather} weatherData={weatherSelection}>
                <p>ICAO</p>
                {metar.station_id}
            </ExpandablePanel>
        </div>
    );
}

export default MetarListItem;
