import React from "react";
import { useFetchMetarByICAOQuery } from "../../../../../store";
import { LocalDbAirport } from "../../../../../types";

interface Props {
    airport: LocalDbAirport;
}

const AirportInfoExpandContent = ({ airport }: Props) => {

    const {
        data: metar,
        error,
        isFetching
    } = useFetchMetarByICAOQuery({
        icao: airport.ident,
        decode: false
    }, { refetchOnMountOrArgChange: true });

    if (error) {
        return (
            <div>
                Unable to fetch weather for {airport.ident.toUpperCase()}
            </div>
        );
    }

    if (isFetching) {
        return (
            <div>
                Loading weather...
            </div>
        );
    }

    if (metar) {
        if (metar.data && metar.results !== 0) {
            const { data } = metar;
            const raw_text = data[0];

            const renderRawText = (
                <div>
                    {raw_text}
                </div>
            );

            return (
                <div className="p-1">
                    METAR:{renderRawText}
                </div>
            );
        }
    }

};

export default AirportInfoExpandContent;