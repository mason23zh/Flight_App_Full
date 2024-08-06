import React, { useEffect, useState } from "react";
import { LocalDbAirport } from "../../../../../types";
import AirportInfoExpandContent_Weather from "./AirportInfoExpandContent_Weather";
import { useFetchDetailAirportWithICAOQuery } from "../../../../../store";
import AirportInfoExpandContent_Atis from "./AirportInfoExpandContent_Atis";

interface Props {
    airport: LocalDbAirport;
}

const AirportDepartureArrivalPanelInfoTab = ({ airport }: Props) => {
    /*
    * The useFetchDetailAirportWithICAOQuery will return ATIS, airport info and weather
    * So we call here and pass the state to child component
    * */
    const {
        data: airportData,
        error: airportDataError,
        isFetching: airportDataFetching
    } = useFetchDetailAirportWithICAOQuery({
        icao: airport.ident,
        decode: true
    });

    const [weatherPanel, setWeatherPanel] = useState(false);
    const [atcPanel, setAtcPanel] = useState(false);

    useEffect(() => {
        setWeatherPanel(false);
        setAtcPanel(false);
    }, []);

    const handleWeatherClick = () => {
        setWeatherPanel(prev => !prev);
    };

    const handleAtcClick = () => {
        setAtcPanel(prev => !prev);
    };

    // TODO: Add airport panel
    return (
        <div className="grid grid-cols-1 font-Rubik gap-2 max-h-full overflow-y-auto p-2 rounded-md">
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
        </div>
    );
};

export default AirportDepartureArrivalPanelInfoTab;