import React from "react";
import AirportDetailWeatherPanel from "./AirportDetailWeatherPanel";
import { Weather } from "../types";

interface Props {
    metar: Weather;
}

function AirportDetailWeatherSection({ metar }: Props) {

    if (!metar) {
        return (
            <div>
                Unable to fetch weather
            </div>
        );
    }

    if (metar) {
        const {
            conditions = [],
            clouds,
            flight_category,
            raw_text,
            temperature,
            dewpoint,
            humidity,
            wind,
            visibility,
            barometer,
        } = metar;

        const renderRawText = (
            // Limit the width here to show the click chevron
            <div className="w-[95%]">
                {raw_text}
            </div>
        );
        return (
            <div className="w-auto">
                <AirportDetailWeatherPanel
                    raw_text={renderRawText}
                    flightCategory={flight_category}
                    temperature={temperature}
                    dewpoint={dewpoint}
                    barometer={barometer}
                    clouds={clouds}
                    conditions={conditions}
                    humidity={humidity}
                    wind={wind}
                    visibility={visibility}
                />
            </div>
        );
    }
}

export default AirportDetailWeatherSection;
