// This accordion will display basic information of airport
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoAirplaneSharp } from "react-icons/io5";
import { useTheme } from "../hooks/ThemeContext";

function AirportAccordion({ airport }) {
    const darkMode = useTheme();
    const themeClass = !darkMode
        ? "self-stretch text-lg p-3 items-center h-full bg-gray-200 drop-shadow-md mt-2.0 border-2 rounded-xl grid grid-rows-4"
            + " airportAccordionSm:grid-cols-3 airportAccordionSm:grid-rows-2"
            + " airportAccordionMd:grid-cols-4 "
        : "self-stretch text-lg p-3 items-center h-full bg-gray-500 drop-shadow-md mt-2.0 border-2 rounded-xl grid grid-rows-4"
            + " airportAccordionSm:grid-cols-3 airportAccordionSm:grid-rows-2"
            + " airportAccordionMd:grid-cols-4 airportAccordionMd:grid-rows-1 ";
    
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
        <div className="align-baseline">
            <div className={themeClass}>
                <div className="text-center row-start-1 row-end-2 col-span-full
                airportAccordionSm:col-start-1 airportAccordionSm:col-end-2 airportAccordionSm:row-start-1 airportAccordionSm:row-end-2
                airportAccordionMd:col-start-1 airportAccordionMd:col-end-2 "
                >
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>ICAO/IATA</div>
                    <div className="contrast-500">{icaoAndIata}</div>
                </div>
                <div className="text-center row-start-2 row-end-3 col-span-full
                airportAccordionSm:col-start-2 airportAccordionSm:col-end-3 airportAccordionSm:row-start-1 airportAccordionSm:row-end-2
                airportAccordionMd:col-start-2 airportAccordionMd:col-end-3 "
                >
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Name</div>
                    <div className={darkMode ? "text-gray-100" : "text-gray-500"}>{station.name}</div>
                </div>
                <div className="text-center row-start-3 row-end-4 col-span-full
                airportAccordionSm:col-start-3 airportAccordionSm:col-end-4 airportAccordionSm:row-start-1 airportAccordionSm:row-end-2
                airportAccordionMd:col-start-3 airportAccordionMd:col-end-4  "
                >
                    <div className={darkMode ? "text-gray-100 font-bold" : "text-gray-500 font-bold"}>Location</div>
                    <div className={darkMode ? "text-gray-100" : "text-gray-500"}>{station.city}, {station.region.region_name}, {station.country.country_name}</div>
                </div>
                <div className="text-center row-start-4 row-end-5 col-span-full
                airportAccordionSm:col-span-full airportAccordionSm:row-start-2 airportAccordionSm:row-end-3
                airportAccordionMd:col-start-4 airportAccordionMd:col-end-5 "
                >
                    <Link
                        onMouseOver={handleLinkClick}
                        to="/airport/detail"
                        className={darkMode
                            ? "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-300 hover:no-underline text-gray-100"
                            : "rounded-lg bg-green-400 py-1 px-3 hover:bg-yellow-400 hover:no-underline"}
                    >Go to
                        Airport
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AirportAccordion;
