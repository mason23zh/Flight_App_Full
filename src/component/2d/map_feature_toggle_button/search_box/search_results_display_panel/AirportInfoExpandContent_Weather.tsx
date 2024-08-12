import React from "react";
import { useFetchTafByICAOQuery } from "../../../../../store";
import { LocalDbAirport } from "../../../../../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { DetailAirportResponseQuery } from "../../../../../store/apis/airportsApi";
import { SerializedError } from "@reduxjs/toolkit";

interface Props {
    airport: LocalDbAirport;
    airportData: DetailAirportResponseQuery;
    airportError: FetchBaseQueryError | SerializedError;
    airportFetching: boolean;
}

const AirportInfoExpandContent_Weather = ({
    airport,
    airportData,
    airportError,
    airportFetching
}: Props) => {

    /**
     * The useFetchDetailAirportWithICAOQuery does not have taf data
     * Need to make another quest to fetch taf data
     */
    const {
        data: taf,
        error: tafError,
        isFetching: tafFetching
    } = useFetchTafByICAOQuery({
        icao: airport.ident,
        decode: false
    });

    if (airportError || tafError) {
        return (
            <div>
                Unable to fetch weather for {airport.ident.toUpperCase()}
            </div>
        );
    }

    if (airportFetching || tafFetching) {
        return (
            <div>
                Loading weather...
            </div>
        );
    }

    const renderRawMetarText = (airportData: DetailAirportResponseQuery) => {
        if (airportData.data && airportData.result !== 0) {
            return (
                <div>
                    {airportData.data[0].METAR?.raw_text || "N/A"}
                </div>
            );
        }

        return (
            <div>
                No METAR available
            </div>
        );
    };

    const renderRawTafText = (taf) => {
        if (taf.data && taf.results !== 0) {
            return (
                <div>
                    {taf.data[0]}
                </div>
            );
        }
        return (
            <div>No TAF available</div>
        );
    };


    if (airportData && taf) {
        return (
            <div className="p-1 rounded-lg max-h-full overflow-y-auto">
                <div className="p-1 grid grid-cols-1 text-sm">
                    <div className="font-bold">
                        METAR
                    </div>
                    <div>
                        {renderRawMetarText(airportData)}
                    </div>
                </div>
                <div className="p-1 grid grid-cols-1 text-sm">
                    <div className="font-bold">
                        TAF
                    </div>
                    <div>
                        {renderRawTafText(taf)}
                    </div>
                </div>
            </div>
        );
    }
};

export default AirportInfoExpandContent_Weather;