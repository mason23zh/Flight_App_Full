/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import L from "leaflet";
import AirportMap from "./AirportMap";
import AirportDetailNameSection from "./AirportDetailNameSection";


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
        const { country_code } = airport.station.country;
        const { name } = airport.station;
        const { ICAO } = airport;
        const [lng, lat] = airport.station.geometry.coordinates;
        return (
            <div className="flex flex-col items-center gap-3">
                <div>
                    <AirportDetailNameSection
                        name={name}
                        icao={ICAO}
                        countryCode={country_code}
                    />
                </div>
                <div>
                    <AirportMap lat={lat} lng={lng} name={name} />
                </div>
            </div>
        );
    }
    return (
        <div>
            Loading...
        </div>
    );
}

export default AirportDetail;
