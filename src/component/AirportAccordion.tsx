// This accordion will display basic information of airport
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";
 
function AirportAccordion({ airport }) {
    const darkMode = useTheme();
    const themeClass = !darkMode
        ? "text-lg p-3 items-center h-full bg-gray-200 drop-shadow-md mt-2 border-2 rounded-xl grid grid-cols-1 md:grid-cols-4"
        : "text-lg p-3 items-center h-full bg-gray-500 drop-shadow-md mt-2 border-2 rounded-xl grid grid-cols-1 md:grid-cols-4";

    const {
        ICAO,
        iata,
        station,
    } = airport;

    const icaoAndIata = iata.length === 0 ? <div>{ICAO}</div> : <div>{ICAO} / {iata}</div>;

    useEffect(() => {
        localStorage.removeItem("airportData");
    }, []);

    const handleLinkClick = () => {
        localStorage.setItem("airportData", JSON.stringify(airport));
    };


    return (
        <div className="align-baseline">
            <div className={themeClass}>
                <div className="text-center p-2">
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>ICAO/IATA</div>
                    <div className="contrast-500">{icaoAndIata}</div>
                </div>
                <div className="text-center p-2">
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Name</div>
                    <div className={darkMode ? "text-gray-100" : "text-gray-500"}>{station.name}</div>
                </div>
                <div className="text-center p-2">
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Location</div>
                    <div className={darkMode ? "text-gray-100" : "text-gray-500"}>{station.city}, {station.region.region_name}, {station.country.country_name}</div>
                </div>
                <div className="col-span-full flex justify-center py-7 md:col-span-1">
                    <Link
                        onMouseOver={handleLinkClick}
                        to="/airport/detail"
                        className={darkMode
                            ? "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-300 hover:no-underline text-gray-100"
                            : "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline"}
                    >Go to Airport
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AirportAccordion;
