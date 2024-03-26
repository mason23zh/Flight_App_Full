import React from "react";
import { useFetchVatsimTrafficByCallsignQuery } from "../../../store";

const LiveDataBlock = ({
    altitude,
    groundspeed,
    toGoDistance,
}) => {


    return (
        <div className="grid grid-cols-3 bg-gray-400 text-lg">
            <div className="flex flex-col items-center">
                <div>
                    Speed
                </div>
                <div>
                    {groundspeed}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div>
                    Altitude
                </div>
                <div>
                    {altitude}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div>
                    To Go
                </div>
                <div>
                    {toGoDistance}
                </div>
            </div>
        </div>
    );
};

export default LiveDataBlock;