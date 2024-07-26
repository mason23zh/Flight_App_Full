import React from "react";
import { DetailAirportResponseQuery } from "../../../../../store/apis/airportsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

//TODO: ATIS render logic is messed up
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
            const vatsimAtis = airportData.data[0].ATIS.vatsim;
            const faaAtis = airportData.data[0].ATIS.faa;

            if (vatsimAtis.length === 0 && faaAtis.length === 0) {
                return <div className="text-center">No ATIS available</div>;
            }

            return (
                <div>
                    {vatsimAtis.length > 0 &&
                        <div className="rounded-xl">
                            <div className="grid grid-cols-1">
                                <div className="flex gap-5 p-2 items-center ">
                                    <div className="flex flex-col p-2">
                                        <div className="text-sm pb-1">VATSIM</div>
                                        <div className="bg-yellow-500 text-white p-2 pt-0 pb-0 text-center">
                                            ATIS
                                        </div>
                                        <div className="bg-gray-800 text-white p-2 text-center text-[18px]">
                                            {vatsimAtis[0].code}
                                        </div>
                                    </div>
                                    <div className="text-left text-sm">{vatsimAtis[0].datis}</div>
                                </div>
                            </div>
                        </div>
                    }
                    {faaAtis.length > 0 &&
                        <div className="rounded-xl">
                            <div className="grid grid-cols-1">
                                <div className="flex gap-5 p-2 items-center ">
                                    <div className="flex flex-col p-2">
                                        <div className="text-sm pb-1 text-center">FAA</div>
                                        <div className="bg-yellow-500 text-white p-2 pt-0 pb-0 text-center">
                                            ATIS
                                        </div>
                                        <div className="bg-gray-800 text-white p-2 text-center text-[18px]">
                                            {faaAtis[0].code}
                                        </div>
                                    </div>
                                    <div className="text-left text-sm">{faaAtis[0].datis}</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            );
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