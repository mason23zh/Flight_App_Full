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
import { useTheme } from "../hooks/ThemeContext";
import AtisSection from "./AtisSection";
import NoMatch from "./NoMatch";
import AirportDetailPanel from "./AirportDetailPanel";
import AirportDetailTafSection from "./AirportDetailTafSection";
import TimeSection from "./TimeSection";
import { DbAirport, DetailAirportResponseAtis, Weather } from "../types";
import GeneralLoading from "./GeneralLoading";
import { useSelector } from "react-redux";
import { RootState, useFetchDetailAirportWithICAOQuery } from "../store";
import { DetailAirportResponseQuery } from "../store/apis/airportsApi";
import Airports from "./Airports";

function AirportDetail() {
    const darkMode = useTheme();
    const themeMode = darkMode ? "dark" : "light";
    const navigate = useNavigate();
    const [airport, setAirport] = useState<DbAirport>();
    const [metar, setMetar] = useState<Weather>();
    const [ATIS, setATIS] = useState<DetailAirportResponseAtis>();

    const { airportICAO } = useSelector((state: RootState) => state.airportSelection);
    const { icao: paramICAO } = useParams();

    const effectiveICAO = paramICAO ? paramICAO.toUpperCase() : airportICAO;
    const isValidICAO = /^[A-Z]{4}$/.test(effectiveICAO);

    const {
        data: fetchedAirportData,
        error: airportDataError,
        isFetching: airportDataFetching,
    } = useFetchDetailAirportWithICAOQuery({
        icao: effectiveICAO,
        decode: true
    }, {
        skip: !isValidICAO
    });

    useEffect(() => {
        if (
            !isValidICAO || airportDataError ||
                (fetchedAirportData &&
                        (fetchedAirportData.result === 0 || fetchedAirportData.data.length === 0))
        ) {
            navigate("/airport");
        }
    }, [fetchedAirportData, airportDataError, navigate]);

    // set fetched data
    useEffect(() => {
        if (fetchedAirportData && fetchedAirportData.result !== 0) {
            setMetar(fetchedAirportData.data[0].METAR || null);
            setAirport(fetchedAirportData.data[0].airport || null);
            setATIS(fetchedAirportData.data[0].ATIS || null);
        }
    }, [fetchedAirportData]);

    if (airportDataFetching) {
        return <GeneralLoading themeMode={themeMode}/>;
    }

    if (airport && fetchedAirportData) {
        const {
            country_code,
            country_name
        } = airport.station.country || {};
        const { region_name } = airport.station.region;
        const { name } = airport.station;
        const {
            type,
            home_link,
            wikipedia_link
        } = airport.additional;
        const {
            ICAO,
            iata,
            elevation,
            transitionAltitude,
        } = airport;
        const [lng, lat] = airport.station.geometry.coordinates;

        return (
            <>
                <CustomProvider theme={themeMode}>
                    <div className="p-3 grid grid-cols-1 items-center justify-items-stretch">
                        <div className="justify-self-end p-1 mt-3 md:mr-3">
                            <TimeSection/>
                        </div>
                        <div className="mt-3 p-2 justify-self-center text-center ">
                            <AirportDetailNameSection
                                name={name}
                                icao={ICAO}
                                countryCode={country_code}
                            />
                        </div>
                        <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                            <AirportDetailWeatherSection metar={metar}/>
                        </div>
                        <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                            <AirportDetailTafSection icao={ICAO}/>
                        </div>
                        <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                            <AtisSection ATIS={ATIS}/>
                        </div>
                        <div className="flex items-center justify-center w-full overflow-hidden mt-3 p-2">
                            <div className="">
                                <AirportMap lat={lat} lng={lng} name={name}/>
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
                            <AirportDetailRunwayTable runways={airport.runways} metar={metar}/>
                        </div>
                    </div>
                </CustomProvider>
            </>
        );
    }
    return null;
}

export default AirportDetail;
 
