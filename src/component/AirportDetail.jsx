/* eslint-disable react/style-prop-object */
/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import AirportMap from "./AirportMap";
import AirportDetailNameSection from "./AirportDetailNameSection";
import AirportDetailTable from "./AirportDetailTable";
import AirportDetailRunwayTable from "./AirportDetailRunwayTable";


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
            <div className="bg-gray-50 flex flex-col">
                <div className="flex flex-col items-center gap-3">
                    <div className="mt-3">
                        <AirportDetailNameSection
                            name={name}
                            icao={ICAO}
                            countryCode={country_code}
                        />
                    </div>
                        
                    <div className="xl:grid grid-rows-1 items-start justify-items-center fs:grid grid-cols-2 items-center justify-items-center p-3 mr-5">
                        <div className="p-5 ml-3">
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
                        <div className="xl:w-[960px] h-[350px] p-5 fs:w-[654px] h-[654px] p-5">
                            <AirportMap lat={lat} lng={lng} name={name} />
                        </div>
                    </div>
                    <div className="p-5 ml-5 mr-5">
                        <AirportDetailRunwayTable runways={airport.runways} />
                    </div>
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
