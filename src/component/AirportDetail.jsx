/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";


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
        console.log(airport);
        const [lng, lat] = airport.station.geometry.coordinates;
        return (
            <div className="flex flex-col items-center">
                <div>
                    Name: {airport.station.name}
                    ICAO: {airport.ICAO}
                </div>
                <div>
                    <MapContainer
                        center={[lat, lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
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
