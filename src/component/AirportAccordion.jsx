// This accordion will display basic information of airport
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";

function AirportAccordion({ airport }) {
    const darkMode = useTheme();
    console.log("darkmode in airport accordion", darkMode);
    const themeClass = !darkMode
        ? "grid grid-cols-4 w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl items-center justify-between bg-gray-100 drop-shadow-md"
        : "grid grid-cols-4 w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl items-center justify-between bg-gray-500 drop-shadow-md";
    
    const {
        ICAO, iata, station,
    } = airport;
    
    const icaoAndIata = iata.length === 0 ? <div>{ICAO}</div> : <div>{ICAO} / {iata}</div>;
    
    useEffect(() => {
        localStorage.removeItem("airportData");
    }, []);
    
    const handleLinkClick = () => {
        localStorage.setItem("airportData", JSON.stringify(airport));
    };
    
    return (
        <div className={themeClass}>
            <div className="text-center">
                <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>ICAO/IATA</div>
                <div className="contrast-500">{icaoAndIata}</div>
            </div>
            <div className="text-center">
                <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Name</div>
                <div>{station.name}</div>
            </div>
            <div className="text-center">
                <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Location</div>
                <div>{station.city}, {station.region.region_name}, {station.country.country_name}</div>
            </div>
            <div className="text-center">
                <Link
                    onMouseOver={handleLinkClick}
                    to="/airport/detail"
                    className="rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline "
                >Go to
                    Airport
                </Link>
            </div>
        </div>
    );
}

export default AirportAccordion;
