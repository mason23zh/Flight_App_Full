import React from "react";
import { useFetchVatsimTrafficByCallsignQuery } from "../../../store";

const LiveDataBlock = ({
    altitude,
    groundspeed,
    toGoDistance,
}) => {


    return (
        <div className="flex gap-3 bg-gray-400">
            <div>
                {groundspeed}
            </div>
            <div>
                {altitude}
            </div>
            <div>
                {toGoDistance}
            </div>
        </div>
    );
};

export default LiveDataBlock;