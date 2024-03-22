import React from "react";
import FlightProgressBar from "./FlightProgressBar";
import { useSelector } from "react-redux";
import { RootState, useFetchBasicAirportWithICAOQuery } from "../../../store";
import distanceInKmBetweenEarthCoordinates from "../../../util/coordinatesDistanceCalculator";

const OverallDataBlock = ({
    callsign,
    progress,
}) => {

    return (
        <div className="container">
            <div className="grid-cols-1 bg-gray-300 gap-3 rounded-lg">
                <div className="text-xl">
                    {callsign}
                </div>
                <div>
                    <FlightProgressBar progress={progress}/>
                </div>
            </div>
        </div>
    );
};

export default OverallDataBlock;