import React from "react";
import FlightProgressBar from "./FlightProgressBar";

const OverallDataBlock = ({
    callsign,
    progress,
    departure,
    arrival
}) => {

    return (
        <div className="container">
            <div className="grid grid-cols-1 bg-gray-300 gap-2 rounded-lg p-3 relative">
                <div className="text-xl">
                    {callsign}
                </div>
                {departure.length === 0 || arrival.length === 0
                    ? <div className="absolute top-0 right-0 rounded-bl-md bg-blue-400 px-2">
                        No Flight Plan
                    </div>
                    : <></>
                }
                <div className="grid grid-cols-[auto,1fr,auto] items-center">
                    <div className="whitespace-nowrap">
                        {departure.length !== 0 ? departure : "N/A"}
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
                        {arrival.length !== 0 ? arrival : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallDataBlock;