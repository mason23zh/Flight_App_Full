import React from "react";
import AirportDisplay from "./AirportDisplay";

function AirportsList({ airports }) {
    const renderedAirports = airports.map((airport) => (
        <div key={airport.id}>
            <AirportDisplay airport={airport} />
        </div>
    ));

    return <div>{renderedAirports}</div>;
}

export default AirportsList;
