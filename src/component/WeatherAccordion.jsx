// This accordion will display basic information of airport
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CustomProvider } from "rsuite";
import AirportDetailWeatherPanel from "./AirportDetailWeatherPanel";
import { useTheme } from "../hooks/ThemeContext";

function WeatherAccordion({ weather }) {
    const [expand, setExpand] = useState(false);
    const darkMode = useTheme();
    const darkModeClass = darkMode
        ? "text-lg p-3 items-center h-full bg-gray-500 drop-shadow-md mt-2 border-2 rounded-xl grid grid-cols-1 md:grid-cols-3"
        : "text-lg p-3 items-center h-full bg-gray-200 drop-shadow-md mt-2 border-2 rounded-xl grid grid-cols-1 md:grid-cols-3";
    
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
    
    useEffect(() => {
        localStorage.removeItem("airportData");
    });
    
    const handleExpand = () => {
        setExpand(!expand);
    };
    
    const handleLinkClick = () => {
        const airport = { ICAO: icao, flag: true };
        localStorage.setItem("airportData", JSON.stringify(airport));
    };
    const renderRawText = (
        // Limit the width here to show the click chevron
        <div className="w-[95%] text-center">
            {raw_text}
        </div>
    );
    
    const expandedContent = () => (
        <div>
            <div className="mt-3 w-auto p-2">
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
                    expand
                />
            </div>
            <div className="text-center mt-3">
                <Link
                    to="/airport/detail"
                    className={darkMode
                        ? "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-300 hover:no-underline text-gray-100"
                        : "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline"}
                    onMouseOver={handleLinkClick}
                >Go to
                    Airport
                </Link>
            </div>
        </div>
    );
    
    
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className={darkModeClass}>
                <div className="text-center p-2">
                    <div className={darkMode ? "text-gray-200 font-bold" : "text-gray-500 font-bold"}>ICAO</div>
                    <div className="contrast-500">{icao}</div>
                </div>
                <div className="text-center p-2">
                    <div className={darkMode ? "text-gray-200 font-bold" : "text-gray-500 font-bold"}>Name</div>
                    <div>{station.location.name}</div>
                </div>
                <div className="col-span-full flex justify-center py-7 md:col-span-1">
                    <div
                        className="cursor-pointer text-gray-500 font-bold p-2 bg-green-400 rounded-xl hover:bg-green-500"
                        onClick={handleExpand}
                    >{expand ? "Hide" : "Detail"}
                    </div>
                </div>
                <div className="md:col-span-full">
                    {expand ? expandedContent() : ""}
                </div>
            </div>
        </CustomProvider>
    );
}

export default WeatherAccordion;
