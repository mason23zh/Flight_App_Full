import React from "react";
import FlightProgressBar from "./FlightProgressBar";
import FlightStatusFlag from "./FlightStatusFlag";
import calculateArrivalTime from "../../../util/calculateArrivalTime";
import { Link } from "react-router-dom";

const OverallDataBlock = ({
    aircraft,
    callsign,
    depAirport,
    arrAirport,
    etd,
    enroute,
    progress
}) => {
    console.log("dep arr:", depAirport);
    console.log("progress:", progress);

    return (
        <div className="container relative">
            <FlightStatusFlag progress={progress}/>
            {/*
                     Callsign and aircraft type
                     */}
            <div className="grid grid-rows-2">
                <div className="grid grid-rows-2 bg-gray-500 p-2">
                    <div className="text-yellow-500 font-bold text-xl font-Rubik">
                        {callsign}
                    </div>
                    <div className="text-white font-bold text-md font-Rubik">
                        {aircraft || "N/A"}
                    </div>
                </div>
                {/*
                         Departure and Arrival Airport
                         */}

                <div className="grid grid-cols-2 bg-gray-200">
                    <div className="flex flex-col justify-center items-center border-r p-3 bg-gray-300">
                        <div className="text-xl font-bold">
                            {depAirport.data[0].ICAO
                                ? <Link to={`/airport/detail/${depAirport.data[0].ICAO}`}>
                                    {depAirport.data[0].ICAO}
                                </Link>
                                : "N/A"
                            }
                        </div>
                        <div className="text-lg truncate w-full text-center"
                            title={depAirport.data[0]?.station.city || "N/A"}>
                            {depAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center p-3 bg-gray-300">
                        <div className="text-xl font-bold">
                            {arrAirport.data[0].ICAO
                                ? <Link to={`/airport/detail/${arrAirport.data[0].ICAO}`}>
                                    {arrAirport.data[0].ICAO}
                                </Link>
                                : "N/A"
                            }
                        </div>
                        <div className="text-lg truncate w-full text-center"
                            title={arrAirport.data[0]?.station.city || "N/A"}>
                            {arrAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 bg-gray-200 border-t-2 font-bold font-Rubik">
                    <div className="flex justify-between p-2 bg-gray-400 border-r">
                        <div>SCHEDULE</div>
                        <div>
                            {etd || "N/A"}
                        </div>
                    </div>
                    <div className="flex justify-between bg-gray-400 p-2">
                        <div>SCHEDULE</div>
                        <div>
                            {etd && enroute
                                ? calculateArrivalTime(etd, enroute)
                                : "N/A"
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-300 p-2">
                <div className="grid grid-cols-[auto,1fr,auto] items-center font-bold font-Rubik">
                    <div className="whitespace-nowrap">
                        {depAirport.data[0]?.iata || "N/A"}
                    </div>
                    <div className="mx-2">
                        {
                            progress !== -1
                                ? <FlightProgressBar progress={progress}/>
                                : <div className="text-center">
                                    Progress N/A
                                </div>
                        }
                    </div>
                    <div className="whitespace-nowrap">
                        {arrAirport.data[0]?.iata || "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
};
// };

export default OverallDataBlock;