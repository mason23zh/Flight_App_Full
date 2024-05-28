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

    return (
        <div className="relative">
            <FlightStatusFlag progress={progress}/>
            {/* Callsign and aircraft type */}
            <div className="grid grid-rows-2">
                <div className="grid grid-rows-2 bg-gray-600 p-2">
                    <div className="text-yellow-500 font-bold text-md md:text-xl font-Rubik">
                        {callsign}
                    </div>
                    <div className="text-white font-bold text-xs md:text-md font-Rubik">
                        {aircraft || "N/A"}
                    </div>
                </div>

                {/*Departure and Arrival Airport*/}

                <div className="grid grid-cols-2 bg-gray-200">
                    <div className="flex flex-col justify-center items-center border-r p-2 md:p-3 bg-gray-300">
                        <div className="text-lg md:text-xl font-bold">
                            {depAirport.data[0]?.ICAO
                                ? <Link to={`/airport/detail/${depAirport.data[0].ICAO}`} className="text-blue-600
                                hover:text-blue-800 underline underline-offset-4 decoration-dashed cursor-pointer">
                                    {depAirport.data[0].ICAO}
                                </Link>
                                : "N/A"
                            }
                        </div>
                        <div className="text-xs md:text-lg truncate w-full text-center"
                            title={depAirport.data[0]?.station.city || "N/A"}>
                            {depAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center border-l p-3 bg-gray-300">
                        <div className="text-lg md:text-xl font-bold">
                            {arrAirport.data[0]?.ICAO
                                ? <Link to={`/airport/detail/${arrAirport.data[0].ICAO}`} className="text-blue-600
                                hover:text-blue-800 decoration-dashed underline underline-offset-4 cursor-pointer"
                                >
                                    {arrAirport.data[0].ICAO}
                                </Link>
                                : "N/A"
                            }
                        </div>
                        <div className="text-xs md:text-lg truncate w-full text-center"
                            title={arrAirport.data[0]?.station.city || "N/A"}>
                            {arrAirport.data[0]?.station.city || "N/A"}
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 font-bold font-Rubik">
                    <div className="flex justify-between p-2 bg-gray-400 border-r text-gray-900">
                        <div>SCHEDULE</div>
                        <div>
                            {etd || "N/A"}
                        </div>
                    </div>
                    <div className="flex justify-between bg-gray-400 p-2 border-l text-gray-900">
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

export default OverallDataBlock;