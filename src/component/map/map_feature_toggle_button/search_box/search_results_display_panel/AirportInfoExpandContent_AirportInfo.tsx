import { DetailAirportResponseQuery } from "../../../../../store/apis/airportsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface Props {
    airportData: DetailAirportResponseQuery;
    airportError: FetchBaseQueryError | SerializedError;
    airportFetching: boolean;
}

const AirportInfoExpandContentAirportInfo = ({
    airportData,
    airportError,
    airportFetching,
}: Props) => {
    if (airportError) {
        return <div>Unable to fetch airport data</div>;
    }

    if (airportFetching) {
        return <div>Loading...</div>;
    }

    const renderAirportInfo = (airportData: DetailAirportResponseQuery) => {
        if (airportData.data && airportData.result !== 0) {
            const airport = airportData.data[0].airport;

            return (
                <div className="grid grid-cols-1 p-2 text-sm">
                    <div className="flex gap-1 p-1">
                        <div>Name:</div>
                        <div>{airport.station.name || "-"}</div>
                    </div>
                    <div className="flex gap-1 p-1">
                        <div>Elevation:</div>
                        <div>{airport.elevation}</div>
                    </div>
                    <div className="flex gap-1 p-1">
                        <div>Country:</div>
                        <div>{airport.station?.country?.country_name || "-"}</div>
                    </div>
                    <div className="flex gap-1 p-1">
                        <div>Region:</div>
                        <div>{airport.station?.region?.region_name || "-"}</div>
                    </div>
                    <div className="flex gap-1 p-1">
                        <div>Transition Altitude:</div>
                        <div>
                            {airport?.transitionAltitude
                                ? `${airport.transitionAltitude} feet`
                                : "-"}
                        </div>
                    </div>
                </div>
            );
        }
    };

    if (airportData) {
        return <div>{renderAirportInfo(airportData)}</div>;
    }
};

export default AirportInfoExpandContentAirportInfo;
