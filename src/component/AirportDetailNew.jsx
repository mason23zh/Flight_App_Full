/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Container, CustomProvider } from "rsuite";
import AirportMap from "./AirportMap";
import AirportDetailNameSection from "./AirportDetailNameSection";
import AirportDetailTable from "./AirportDetailTableNew";
import AirportDetailRunwayTable from "./AirportDetailRunwayTable";
import AirportDetailWeatherSection from "./AirportDetailWeatherSection";
import AirportDetailTrafficWidget from "./AirportDetailTrafficWidget";
import { useFetchDetailAirportWithICAO_WidgetQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";

function AirportDetail() {
    const darkMode = useTheme();
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
                <div className="mt-5 w-auto tableShrinkAgain:w-[960px] tableShrink:w-[1210px]">
                    <AirportDetailTrafficWidget iata={airport.iata} airportName={airport.station.name} />
                </div>
            );
        }
    };
    
    const themeMode = darkMode ? "dark" : "light";
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
            <CustomProvider theme={themeMode}>
                <div className="p-3 grid grid-cols-1 items-center justify-items-stretch">
                    <div className="mt-3 p-2 justify-self-center text-center ">
                        <AirportDetailNameSection
                            name={name}
                            icao={ICAO}
                            countryCode={country_code}
                        />
                    </div>
                    <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                        <AirportDetailWeatherSection icao={ICAO} />
                    </div>
                    <div className="justify-self-center mt-3 p-2">
                        <div className="ml-10 mr-10">
                            <AirportMap lat={lat} lng={lng} name={name} />
                        </div>
                    </div>
                    <div className="mt-3 p-2 w-[80%] justify-self-center">
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
                    <div className="mt-3 p-2 max-w-[1230px] w-[84%] justify-self-center">
                        <AirportDetailRunwayTable runways={airport.runways} metar={metar} />
                    </div>
                    <div className="mt-3 p-2 justify-self-center">{renderWidget()}</div>
                </div>
            </CustomProvider>
        );
    }
    return (
    // 1250
        <CustomProvider theme={themeMode}>
            <div className="text-lg text-center">
                Loading...
            </div>
        </CustomProvider>
    );
}

export default AirportDetail;