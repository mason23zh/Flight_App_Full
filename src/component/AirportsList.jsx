import React from "react";
import AirportDisplay from "./AirportDisplay";
import AirportAccordion from "./AirportAccordion";

function AirportsList({ airports }) {
    const renderedAirports = airports.data.map((airport) => (
        <div key={airport.ICAO}>
            <AirportAccordion airport={airport} />
        </div>
    ));
    
    return <div className="flex flex-col gap-4 p-10 items-center ">{renderedAirports}</div>;
}

export default AirportsList;
