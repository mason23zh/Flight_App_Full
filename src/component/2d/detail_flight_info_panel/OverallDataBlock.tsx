import React from "react";
import FlightProgressBar from "./FlightProgressBar";
import FlightStatusFlag from "./FlightStatusFlag";
import calculateArrivalTime from "../../../util/calculateArrivalTime";
import { Link } from "react-router-dom";
import getAircraftCallsignName from "../../../util/getAircraftCallsignName";
import { IoInformationCircleOutline } from "react-icons/io5";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";
import { BiTargetLock } from "react-icons/bi";
import { useDispatch } from "react-redux";
import useIsTouchScreen from "../../../hooks/useIsTouchScreen";
import { useMap } from "react-map-gl";


const OverallDataBlock = ({
    aircraft,
    position,
    callsign,
    depAirport,
    arrAirport,
    etd,
    enroute,
    progress
}) => {
    const isTouchScreen = useIsTouchScreen();
    const airlinerInfo = getAircraftCallsignName(callsign);
    const { current: mapRef } = useMap();

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
        tooltipVisible,
    } = useDisplayTooltip(200);

    const {
        handleMouseMove: handleTrackMouseMove,
        handleMouseLeave: handleTrackMouseLeave,
        handleMouseEnter: handleTrackMouseEnter,
        tooltipVisible: trackTooltipVisible,
    } = useDisplayTooltip(200);

    const handleTrackingClick = () => {
        if (mapRef) {
            const map = mapRef?.getMap();
            map.flyTo({
                center: position,
                zoom: 10
            });
        }
    };

    return (
        <div className="relative">
            <FlightStatusFlag progress={progress}/>
            {/* Callsign and aircraft type */}
            <div className="grid grid-rows-2">
                <div className={`grid ${airlinerInfo ? "grid-rows-3" : "grid-rows-2"} bg-gray-600 p-2`}>
                    <div className="flex items-center gap-3">
                        <div className="text-yellow-500 font-bold text-[15px] md:text-xl font-Rubik">
                            {callsign}
                        </div>
                        <div
                            onClick={handleTrackingClick}
                            onMouseEnter={handleTrackMouseEnter}
                            onMouseLeave={handleTrackMouseLeave}
                            onMouseMove={handleTrackMouseMove}
                            className="text-gray-100 text-[17px] hover:cursor-pointer hover:text-gray-300 relative">
                            <BiTargetLock/>
                            {(trackTooltipVisible && !isTouchScreen) &&
                                <div className="absolute left-full top-1/2 
                                transform -translate-y-1/2 ml-2
                                bg-blue-500 text-white text-xs
                                rounded-md px-2 py-1 flex whitespace-nowrap"
                                >
                                    <div>
                                        Move to traffic
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        airlinerInfo &&
                        <div
                            className="text-white text-xs md:text-sm font-Rubik flex items-center gap-1">
                            {airlinerInfo.name}

                            <div
                                className="relative text-[15px] md:text-[20px]"
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseEnter}
                                onMouseMove={handleMouseMove}
                            >
                                <IoInformationCircleOutline/>
                                {(tooltipVisible && !isTouchScreen) &&
                                <div
                                    className="fixed px-2 py-1 bg-blue-500 rounded-md
                                    flex flex-col text-xs font-Rubik text-gray-100
                                    transition translate-y-[10%]"
                                >
                                    <div className="flex items-center gap-1">
                                        <div>
                                            Callsign:
                                        </div>
                                        <div>
                                            {airlinerInfo?.callsign}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div>
                                            Country:
                                        </div>
                                        <div>
                                            {airlinerInfo?.country}
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    }


                    <div className="text-white md:font-bold text-xs md:text-sm font-Rubik">
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