import React from "react";
import FlightProgressBar from "./FlightProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const OverallDataBlock = ({
    callsign,
    flight_plan
}) => {
    return (
        <div className="container">
            <div className="grid-cols-1 bg-gray-300 gap-3 rounded-lg">
                <div className="text-xl">
                    {callsign}
                </div>
                <div>
                    <FlightProgressBar/>
                </div>
            </div>
        </div>
    );
};

export default OverallDataBlock;