// This accordion will display basic information of airport
import React from "react";

function AirportAccordion({ airport }) {
    const {
        ICAO, iata, elevation, station,
    } = airport;
    
    const icaoAndIata = iata.length === 0 ? <div>{ICAO}</div> : <div>{ICAO} / {iata}</div>;
    
    return (
        <div className="grid grid-cols-4 w-[1080px] h-full text-lg p-3 mt-2.0 border-2 rounded-xl items-center justify-between bg-gray-100 drop-shadow-md">
            <div className="text-center">
                <div className="text-gray-500 font-bold">ICAO/IATA</div>
                <div className="contrast-500">{icaoAndIata}</div>
            </div>
            <div className="text-center">
                <div className="text-gray-500 font-bold">Name</div>
                <div>{station.name}</div>
            </div>
            <div className="text-center">
                <div className="text-gray-500 font-bold">Location</div>
                <div>{station.city}, {station.region.region_name}, {station.country.country_name}</div>
            </div>
            <div className="text-center">
                <button type="submit" className="rounded-lg bg-green-400 py-1 px-3">Go to airport</button>
            </div>
        </div>
    );
}

export default AirportAccordion;
