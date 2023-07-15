/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function AirportDetail() {
    const [airport, setAirport] = useState();
    
    // get localStorage airport data
    useEffect(() => {
        const airportData = JSON.parse(localStorage.getItem("airportData"));
        if (airportData) {
            setAirport(airportData);
        }
    }, []);
    
    if (airport) {
        return (
            <div>
                Name: {airport.station.name}
                ICAO: {airport.ICAO}
            </div>
        );
    }
}

export default AirportDetail;
