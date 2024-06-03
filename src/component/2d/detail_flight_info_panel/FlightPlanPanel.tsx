import React from "react";
import { AirportResponse, VatsimFlightPlan } from "../../../types";

interface FlightPlanPanelProps {
    flight_plan: VatsimFlightPlan;
    depAirport: AirportResponse;
    arrAirport: AirportResponse;

}

const FlightPlanPanel = ({
    flight_plan,
    depAirport,
    arrAirport
}: FlightPlanPanelProps) => {

    const route = flight_plan.route || "N/A";

    const depAirportName = depAirport.data[0]?.station.name || "N/A";
    const depAirportRegion = depAirport.data[0]?.station.region.region_name || "N/A";
    const depAirportCity = depAirport.data[0]?.station.city || "N/A";

    const arrAirportRegion = arrAirport.data[0]?.station.region.region_name || "N/A";
    const arrAirportName = arrAirport.data[0]?.station.name || "N/A";
    const arrAirportCity = arrAirport.data[0]?.station.city || "N/A";


    return (
        <div className="bg-gray-500/30 p-3 backdrop-blur-lg
        font-Rubik text-sm text-white text-center max-w-screen-xl
        max-h-[400px] mx-auto overflow-y-auto">
            <div className="grid grid-rows-1 gap-5 h-auto">
                <div className="grid grid-cols-[min-content_1fr] gap-8 items-start">
                    <div className="shrink-0">Departure</div>
                    <div className="flex flex-col space-y-1">
                        <div className="text-left">
                            {depAirportName}
                        </div>
                        <div className="flex justify-end space-x-1 text-xs text-gray-300">
                            <span>{depAirportCity},</span>
                            <span>{depAirportRegion}</span>
                        </div>
                    </div>
                    <div className="shrink-0">Arrival</div>
                    <div className="flex flex-col space-y-1">
                        <div className="text-left">
                            {arrAirportName}
                        </div>
                        <div className="flex justify-end space-x-1 text-xs text-gray-300">
                            <span>{arrAirportCity},</span>
                            <span>{arrAirportRegion}</span>
                        </div>
                    </div>
                    <div className="shrink-0">Route</div>
                    <div className="text-left text-sm">
                        {route}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightPlanPanel;