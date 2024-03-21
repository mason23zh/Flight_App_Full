import React from "react";

const LiveDataBlock = ({
    altitude,
    groundspeed,
    departure,
    arrival
}) => {
    return (
        <div className="flex gap-3">
            <div>
                {groundspeed}
            </div>
            <div>
                {altitude}
            </div>
            <div>
                To go
            </div>
        </div>
    );
};

export default LiveDataBlock;