/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AirportMap from "./AirportMap";
import AirportDetailNameSection from "./AirportDetailNameSection";
import AirportDetailTable from "./AirportDetailTable";
import AirportDetailRunwayTable from "./AirportDetailRunwayTable";
import AirportDetailWeatherSection from "./AirportDetailWeatherSection";
import Skeleton from "./Skeleton";
import AirportDetailTrafficWidget from "./AirportDetailTrafficWidget";
import { useFetchDetailAirportWithICAO_WidgetQuery } from "../store";

function AirportDetail() {
    const [airport, setAirport] = useState();
    const [metar, setMetar] = useState({});
    const [skipRender, setSkipRender] = useState(true);
    const [widgetAvailable, setWidgetAvailable] = useState(false);
    
    
    // get localStorage airport data
    useEffect(() => {
        const airportData = JSON.parse(localStorage.getItem("airportData"));
        if (airportData && !airportData?.flag) {
            setAirport(airportData);
            setSkipRender(false);
            localStorage.removeItem("airportData");
        } else if (airportData && airportData.flag === true) {
            const requestAirport = async (storageICAO) => {
                try {
                    const response = await axios.get(`https://flight-data.herokuapp.com/api/v1/airports/icao/${storageICAO}?decode=true`);
                    if (response) {
                        setAirport(response.data.data[0].airport);
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            
            requestAirport(airportData.ICAO).catch(console.error);
            setSkipRender(false);
            localStorage.removeItem("airportData");
        }
    }, []);
    
    // !this is a redundant request, but needed to be here because we need to check the widget availability
    // !from the server, and passing wind data to Runway Table
    // !code refactor required
    const {
        data: widgetData,
        error: widgetError,
        isFetching: widgetFetching,
    } = useFetchDetailAirportWithICAO_WidgetQuery({ icao: airport?.ICAO, decode: true }, {
        skip: skipRender,
        refetchOnMountOrArgChange: true,
    });
    
    useEffect(() => {
        if (widgetData) {
            if (widgetData.results > 0) {
                // check widget
                if (!widgetData.data[0].widget || widgetData.data[0].widget === false) {
                    setWidgetAvailable(false);
                } else {
                    setWidgetAvailable(true);
                }
                
                // check METAR
                if (widgetData.data[0].METAR) {
                    setMetar(widgetData.data[0].METAR);
                }
            }
        }
    }, [widgetData]);
    
    
    const renderWidget = () => {
        if (widgetAvailable) {
            return (
                <div className="mt-5 w-[700px] tableShrinkAgain:w-[960px] tableShrink:w-[1210px]">
                    <AirportDetailTrafficWidget iata={airport.iata} airportName={airport.station.name} />
                </div>
            );
        }
    };
    
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
            <div className="flex flex-col items-center bg-gray-50">
                <div className="bg-gray-50 flex flex-col p-5 mb-10 items-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="mt-3">
                            <AirportDetailNameSection
                                name={name}
                                icao={ICAO}
                                countryCode={country_code}
                            />
                        </div>
                            
                        <div className="p-3">
                            <AirportDetailWeatherSection icao={ICAO} />
                        </div>
                            
                        <div className="xl:grid grid-rows-1 items-start justify-items-center fs:grid grid-cols-2 items-center justify-items-center mr-5">
                            <div className="p-3 ml-3">
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
                            <div className="xl:w-[960px] h-[350px] p-3 fs:w-[654px] h-[654px] p-5">
                                <AirportMap lat={lat} lng={lng} name={name} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[700px] tableShrinkAgain:w-[960px] tableShrink:w-[1210px] ">
                    <AirportDetailRunwayTable runways={airport.runways} metar={metar} />
                </div>
                {renderWidget()}
            </div>
        );
    }
    return (
    // 1250
        <div>
            <Skeleton className="h-8 w-auto" times={10} />;
        </div>
    );
}

export default AirportDetail;
