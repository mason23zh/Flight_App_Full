// This accordion will display basic information of airport
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AirportDetailWeatherPanel from "./AirportDetailWeatherPanel";

function WeatherAccordion({ weather }) {
    const [expand, setExpand] = useState(false);
    
    const {
        icao,
        station,
        raw_text,
        flight_category,
        temperature,
        dewpoint,
        barometer,
        clouds,
        conditions,
        humidity,
        wind,
        visibility,
    } = weather;
    
    const handleExpand = () => {
        setExpand(!expand);
    };
    
    const expandedContent = () => (
        <div>
            <div className="w-[calc(100%+2rem)]">
                <AirportDetailWeatherPanel
                    raw_text={raw_text}
                    flightCategory={flight_category}
                    temperature={temperature}
                    dewpoint={dewpoint}
                    barometer={barometer}
                    clouds={clouds}
                    conditions={conditions}
                    humidity={humidity}
                    wind={wind}
                    visibility={visibility}
                    expand
                />
            </div>
            
        </div>
    );
    
    
    return (
        <div className="flex flex-col items-center justify-center w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl bg-gray-100 drop-shadow-md">
            <div className="grid grid-cols-3 w-[1080px] h-full justify-between items-center">
                <div className="text-center">
                    <div className="text-gray-500 font-bold">ICAO</div>
                    <div className="contrast-500">{icao}</div>
                </div>
                <div className="text-center">
                    <div className="text-gray-500 font-bold">Name</div>
                    <div>{station.location.name}</div>
                </div>
                <div className="text-center">
                    <div className="flex flex-col items-center">
                        <div
                            className="cursor-pointer w-[35%] text-gray-500 font-bold p-2 bg-green-400 rounded-xl hover:bg-green-500"
                            onClick={handleExpand}
                        >{expand ? "Hide" : "Detail"}
                        </div>
                    </div>
                </div>
            </div>
            {expand ? expandedContent() : ""}
        </div>
    );
}

export default WeatherAccordion;
