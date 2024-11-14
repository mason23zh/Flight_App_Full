import React, { useEffect, useState } from "react";
import { LocalDbAirport } from "../../../../../types";
import AirportInfoExpandContent_Weather from "./AirportInfoExpandContent_Weather";
import { useFetchDetailAirportWithICAOQuery } from "../../../../../store";
import AirportInfoExpandContent_Atis from "./AirportInfoExpandContent_Atis";
import AirportInfoExpandContent_AirportInfo from "./AirportInfoExpandContent_AirportInfo";

interface Props {
    airport: LocalDbAirport;
}

//TODO: Change height
const AirportDepartureArrivalPanelInfoTab = ({ airport }: Props) => {
    /*
    * The useFetchDetailAirportWithICAOQuery will return ATIS, airport info and weather
    * So we call here and pass the state to child component
    * */
    if (!airport) return null;

    const {
        data: airportData,
        error: airportDataError,
        isFetching: airportDataFetching
    } = useFetchDetailAirportWithICAOQuery({
        icao: airport?.ident,
        decode: true
    });

    const [weatherPanel, setWeatherPanel] = useState(false);
    const [atcPanel, setAtcPanel] = useState(false);
    const [airportInfoPanel, setAirportInfoPanel] = useState(false);

    useEffect(() => {
        setWeatherPanel(false);
        setAtcPanel(false);
        setAirportInfoPanel(false);
    }, []);

    const handleWeatherClick = () => {
        setWeatherPanel(prev => !prev);
    };

    const handleAtcClick = () => {
        setAtcPanel(prev => !prev);
    };

    const handleAirportInfoClick = () => {
        setAirportInfoPanel(prev => !prev);
    };

    if (airportDataError) {
        return (
            <div>
                Error Loading data
            </div>
        );
    }

    if (airportDataFetching) {
        return (
            <div>
                Loading data...
            </div>
        );
    }

    //530px = 397.5pt
    return (
        <div className="flex flex-col gap-2 max-h-[45vh] sm:max-h-[397.5pt] overflow-y-auto p-2 rounded-md">
            <div
                onClick={handleWeatherClick}
                className="hover:cursor-pointer border-[1px] rounded-md p-1 hover:bg-gray-600"
            >
                <div className="items-center text-[17px] sm:text-[18px] text-center">
                    Weather
                </div>
                {weatherPanel &&
                    <AirportInfoExpandContent_Weather
                        airport={airport}
                        airportData={airportData}
                        airportError={airportDataError}
                        airportFetching={airportDataFetching}
                    />
                }
            </div>

            <div
                onClick={handleAtcClick}
                className="hover:cursor-pointer border-[1px] rounded-md p-1 hover:bg-gray-600"
            >
                <div className="items-center text-[17px] sm:text-[18px] text-center">
                    ATIS
                </div>
                {atcPanel &&
                    <AirportInfoExpandContent_Atis
                        airportData={airportData}
                        airportError={airportDataError}
                        airportFetching={airportDataFetching}
                    />
                }
            </div>
            <div
                onClick={handleAirportInfoClick}
                className="hover:cursor-pointer border-[1px] rounded-md p-1 hover:bg-gray-600"
            >
                <div className="items-center text-[17px] sm:text-[18px] text-center">
                    Info
                </div>
                {airportInfoPanel &&
                    <AirportInfoExpandContent_AirportInfo
                        airportData={airportData}
                        airportError={airportDataError}
                        airportFetching={airportDataFetching}
                    />
                }
            </div>
        </div>
    );
};

export default AirportDepartureArrivalPanelInfoTab;