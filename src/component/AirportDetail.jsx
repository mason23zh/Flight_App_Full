/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CustomProvider } from "rsuite";
import { useNavigate, useParams } from "react-router-dom";
import AirportMap from "./AirportMap";
import AirportDetailNameSection from "./AirportDetailNameSection";
import AirportDetailRunwayTable from "./AirportDetailRunwayTable";
import AirportDetailWeatherSection from "./AirportDetailWeatherSection";
import AirportDetailTrafficWidget from "./AirportDetailTrafficWidget";
import { useFetchDetailAirportWithICAO_WidgetQuery } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import AtisSection from "./AtisSection";
import NoMatch from "./NoMatch";
import AirportDetailPanel from "./AirportDetailPanel";
import AirportDetailTafSection from "./AirportDetailTafSection";
import TimeSection from "./TimeSection";
import VatsimEventSection from "./VatsimEventSection";


function AirportDetail() {
    const darkMode = useTheme();
    const navigate = useNavigate();
    const [airport, setAirport] = useState();
    const [metar, setMetar] = useState({});
    const [skipRender, setSkipRender] = useState(true);
    const [widgetAvailable, setWidgetAvailable] = useState(false);
    const [ATIS, setATIS] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
    setTimeout(() => setIsLoading(false), 5000);
    
    const { icao: paramICAO } = useParams();
    
    useEffect(() => {
        if (!localStorage.getItem("airportData")) {
            navigate("/");
        }
    });
    
    // Update airport visited count
    useEffect(() => {
        if (airport && airport.ICAO?.length !== 0) {
            const updateVisited = async (icao) => {
                await axios.put("https://api.airportweather.org/v1/airports/update-visited", { icao: `${icao}` });
            };
            updateVisited(airport.ICAO);
        }
    }, [airport]);
    
    // get localStorage airport data
    useEffect(() => {
        const airportData = JSON.parse(localStorage.getItem("airportData"));
        // if URLs ICAO not equal to localStorage's airport
        if (airportData && airportData.ICAO !== paramICAO.toUpperCase()) {
            const requestAirport = async (icao) => {
                try {
                    const response = await axios.get(`https://api.airportweather.org/v1/airports/icao/${icao}?decode=true`);
                    if (response && response.data.data.length > 0) {
                        setAirport(response.data.data[0].airport);
                        localStorage.setItem("airportData", JSON.stringify(response.data.data[0].airport));
                    }
                } catch (e) {
                    navigate("/airport");
                }
            };
            requestAirport(paramICAO).catch();
            setSkipRender(false);
        }
        
        if (airportData && !airportData?.flag) {
            setAirport(airportData);
            setSkipRender(false);
        } else if (airportData && airportData.flag === true) {
            const requestAirport = async (storageICAO) => {
                try {
                    const response = await axios.get(`https://api.airportweather.org/v1/airports/icao/${storageICAO}?decode=true`);
                    if (response) {
                        setAirport(response.data.data[0].airport);
                    }
                } catch (e) {
                    navigate("/airport");
                }
            };
            requestAirport(airportData.ICAO).catch();
            setSkipRender(false);
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
                
                // check ATIS
                if (widgetData.data[0].ATIS) {
                    setATIS(widgetData.data[0].ATIS);
                }
            }
        }
    }, [widgetData]);
    
    
    const renderWidget = () => {
        if (widgetAvailable) {
            return (
                <div className="mt-5 w-full tableShrinkAgain:w-[1000px] transform transition-all ease-in-out duration-300">
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
                    <div className="justify-self-end p-1 mt-3 md:mr-3">
                        <TimeSection />
                    </div>
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
                    <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                        <AirportDetailTafSection icao={ICAO} />
                    </div>
                    <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                        <AtisSection ATIS={ATIS} />
                    </div>
                    <div className="flex items-center justify-center w-full overflow-hidden mt-3 p-2">
                        <div className="">
                            <AirportMap lat={lat} lng={lng} name={name} />
                        </div>
                    </div>
                        
                    <div className="mt-3 w-[100%] md:w-[70%] ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                        <div className="w-auto">
                            <AirportDetailPanel
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
                    </div>
                    <div className="mt-3 p-2 max-w-[1230px] w-[90%] justify-self-center">
                        <AirportDetailRunwayTable runways={airport.runways} metar={metar} />
                    </div>
                    <VatsimEventSection />
                    <div className="ml-3 mr-3 p-2 justify-self-center">{renderWidget()}</div>
                </div>
            </CustomProvider>
        );
    }
    return (
        <div>
            {!isLoading ? <NoMatch /> : <div className="text-center">Loading...</div>}
        </div>
    );
}

export default AirportDetail;
