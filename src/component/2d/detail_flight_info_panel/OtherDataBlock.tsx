import React from "react";

const OtherDataBlock = ({ flight_plan }) => {
    if (!flight_plan) {
        return (
            <div>No Flight Plan</div>
        );
    }


    return (
        <div>
            Other info block
        </div>
    );
};

export default OtherDataBlock;