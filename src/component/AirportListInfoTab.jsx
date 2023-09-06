import React from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/ThemeContext";

function AirportListInfoTab({ airport, counter }) {
    const {
        ICAO, iata, station,
    } = airport;
    const icaoAndIata = iata.length === 0
        ? <div>{ICAO}</div>
        : (
            <div className="flex justify-center items-center gap-1">
                <div>{ICAO}</div>
                <div className="hidden md:block">/</div>
                <div className="hidden md:block">{iata}</div>
            </div>
        );
    
    const darkMode = useTheme();
    const themeClass = darkMode
        ? "border-2 rounded-3xl grid grid-cols-3 "
            + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
            + "h-full bg-gray-500"
        : "border-2 rounded-3xl grid grid-cols-3 "
            + "sm:grid-cols-4 md:grid-cols-5 text-center justify-items-center items-center "
            + "h-full bg-gray-300";
    
    const handleClick = () => {
        localStorage.setItem("airportData", JSON.stringify(airport));
    };
    
    const elevationSection = (
        airport.elevation
            && (
                <div className="items-center">
                    Elevation: {airport.elevation} ft
                </div>
            )
    );
    
    const nameSection = (
        <div className="items-center">
            {station.name}
        </div>
    );
    
    const icaoSection = (
        <div>{icaoAndIata}</div>
    );
    
    const locationSection = (
        <div>
            <div className="hidden lg:block">
                {station.city}, {station.region.region_name}, {station.country.country_name}
            </div>
            <div className="hidden md:block lg:hidden">
                {station.city}, {station.country.country_name}
            </div>
            <div className="block md:hidden">
                {station.city}
            </div>
        </div>
    );
    
    
    const goToAirportIcon = (
        <Link
            to="/airport/detail"
            onMouseOver={handleClick}
        >
            <IoIosArrowRoundForward size={40} />
        </Link>
    );
    
    
    return (
        <div className={themeClass}>
            <div className="justify-self-start p-2 ml-3">
                {icaoSection}
            </div>
            <div className="p-2 justify-self-center hidden md:block">
                {nameSection}
            </div>
            <div className="p-2 justify-self-center">
                {locationSection}
            </div>
            <div className="justify-self-center p-2 hidden sm:block">
                {elevationSection}
            </div>
            <div className="justify-self-end mr-3 p-2">
                {goToAirportIcon}
            </div>
        </div>
    );
}

export default AirportListInfoTab;
