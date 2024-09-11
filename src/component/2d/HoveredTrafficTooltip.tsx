import React from "react";
import { VatsimFlight } from "../../types";

interface HoveredTrafficTooltipProps {
    info: VatsimFlight;
}

const HoveredTrafficTooltip = ({ info }: HoveredTrafficTooltipProps) => {
    return (
        <div className="flex flex-col p-1 bg-gray-500 text-gray-100">
            <div className="flex gap-2 items-center justify-between border-b">
                <div>
                    {info.callsign}
                </div>
                <div>
                    |
                </div>
                <div>
                    {info?.flight_plan?.aircraft_short || "-"}
                </div>
            </div>


            <div className="flex gap-2">
                <div>
                    {info?.flight_plan?.departure}
                </div>
                <div>-</div>
                <div>
                    {info?.flight_plan?.arrival}
                </div>
            </div>
        </div>
    );
};

export default HoveredTrafficTooltip;