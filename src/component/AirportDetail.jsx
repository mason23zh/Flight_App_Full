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
import AirportDetailTable from "./AirportDetailTable";


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
        const { country_code, country_name } = airport.station.country;
        const { region_name } = airport.station.region;
        const { name } = airport.station;
        const { type, home_link, wikipedia_link } = airport.additional;
        const {
            ICAO, iata, elevation, transitionAltitude,
        } = airport;
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
                <div className="w-[600px] h-[600px]">
                    <AirportMap lat={lat} lng={lng} name={name} />
                </div>
                <AirportDetailTable
                    ICAO={ICAO}
                    iata={iata}
                    region={region_name}
                    country={country_name}
                    runwayCount={airport.runways.length}
                    airportType={type}
                    elevation={elevation}
                    transitionAltitude={transitionAltitude}
                    lng={lng}
                    lat={lat}
                    homeLink={home_link}
                    wikiLink={wikipedia_link}
                />
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
