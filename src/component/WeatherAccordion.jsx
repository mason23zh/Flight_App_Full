// This accordion will display basic information of airport
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CustomProvider } from "rsuite";
import AirportDetailWeatherPanel from "./AirportDetailWeatherPanel";
import { useTheme } from "../hooks/ThemeContext";

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
            <div className="text-center mt-3">
                <Link
                    to="/airport/detail"
                    className="rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline "
                    onMouseOver={handleLinkClick}
                >Go to
                    Airport
                </Link>
            </div>
        </div>
    
    );
    
    const darkMode = useTheme();
    const darkTheme = darkMode ? "dark" : "light";
    const darkModeClass = darkMode
        ? "flex flex-col items-center justify-center w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl bg-gray-500 drop-shadow-md"
        : "flex flex-col items-center justify-center w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl bg-gray-100 drop-shadow-md";
    return (
        <CustomProvider theme={darkTheme}>
            <div className={darkModeClass}>
                <div className="grid grid-cols-3 w-[1080px] h-full justify-between items-center">
                    <div className="text-center">
                        <div className={darkMode ? "text-gray-200 font-bold" : "text-gray-500 font-bold"}>ICAO</div>
                        <div className="contrast-500">{icao}</div>
                    </div>
                    <div className="text-center">
                        <div className={darkMode ? "text-gray-200 font-bold" : "text-gray-500 font-bold"}>Name</div>
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
        </CustomProvider>
    );
}

export default WeatherAccordion;
