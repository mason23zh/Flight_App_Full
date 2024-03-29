import React from "react";
import FlightPlanPanel from "./FlightPlanPanel";

const OtherDataBlock = ({
    flight_plan,
    depAirport,
    arrAirport
}) => {
    if (!flight_plan) {
        return (
            <div className="bg-gray-500/30 p-3
            backdrop-blur-lg font-Rubik
            text-sm text-white text-center"
            >
                No Flight Plan Available For This Flight
            </div>
        );
    }


    return (
        <FlightPlanPanel
            flight_plan={flight_plan}
            depAirport={depAirport}
            arrAirport={arrAirport}
        />
    );
};

export default OtherDataBlock;