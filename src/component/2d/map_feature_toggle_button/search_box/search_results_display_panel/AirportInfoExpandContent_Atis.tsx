import React from "react";
import { DetailAirportResponseQuery } from "../../../../../store/apis/airportsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface Props {
    airportData: DetailAirportResponseQuery;
    airportError: FetchBaseQueryError | SerializedError;
    airportFetching: boolean;
}

const AirportInfoExpandContentAtis = ({
    airportData,
    airportError,
    airportFetching
}: Props) => {

    if (airportError) {
        return (
            <div>
                Unable to Fetching ATIS
            </div>
        );
    }

    if (airportFetching) {
        return (
            <div>
                Loading ATIS...
            </div>
        );
    }

    const renderAtis = (airportData: DetailAirportResponseQuery) => {
        if (airportData.data && airportData.result !== 0) {
            const atis = airportData.data[0].ATIS?.vatsim;
            if (typeof atis === "string") {
                return (
                    <div>
                        {atis}
                    </div>
                );
            } else if (typeof atis === "object" && "code" in atis) {
                return (
                    <div>
                        <div className="rounded-xl">
                            <div className="grid grid-cols-1">
                                <div className="flex gap-5 p-2 items-center ">
                                    <div className="flex flex-col p-2">
                                        <div className="text-sm pb-1">VATSIM</div>
                                        <div className="bg-yellow-500 text-white p-2 pt-0 pb-0 text-center">
                                            ATIS
                                        </div>
                                        <div className="bg-gray-800 text-white p-2 text-center text-[18px]">
                                            {atis.code}
                                        </div>
                                    </div>
                                    <div className="text-left text-sm">{atis.datis}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    };

    if (airportData) {
        return (
            <div>
                {renderAtis(airportData)}
            </div>
        );
    }
};

export default AirportInfoExpandContentAtis;