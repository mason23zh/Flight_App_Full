import { useMemo } from "react";
import { VatsimFlight } from "../../types";
import calculateFlightProgress from "../../util/calculateFlightProgressBasedOnTime";
import HoveredTrafficTooltipFlightProgressBar from "./HoveredTrafficTooltipFlightProgressBar";

interface HoveredTrafficTooltipProps {
    info: VatsimFlight;
}

const HoveredTrafficTooltip = ({ info }: HoveredTrafficTooltipProps) => {
    const progress = useMemo(() => calculateFlightProgress(info), [info?.callsign]);

    return (
        <div className="w-64 rounded-lg bg-gray-700 p-4 text-white shadow-md">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-bold text-blue-500">{info?.callsign || "N/A"}</p>
                <p className="text-sm font-bold text-gray-200">
                    {info?.flight_plan?.aircraft_short || "-"}
                </p>
            </div>

            <hr className="my-2 border-gray-400" />

            <div className="mb-4 grid grid-cols-3 items-center gap-3">
                <div className="text-center">
                    <p className="text-sm font-bold">{info?.flight_plan?.departure || "N/A"}</p>
                </div>

                {/* <hr className="my-5 border-gray-700"/> */}
                <div className="w-full">
                    <HoveredTrafficTooltipFlightProgressBar progress={progress} />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold">{info?.flight_plan?.arrival || "N/A"}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded bg-gray-600 p-1">
                    <p className="text-sm font-bold">GS</p>
                    <p className="text-sm">{info?.groundspeed || "0"} kts</p>
                </div>

                <div className="rounded bg-gray-600 p-1">
                    <p className="text-sm font-bold">Altitude</p>
                    <p className="text-sm">{info?.altitude || "-"} ft</p>
                </div>

                <div className="rounded bg-gray-600 p-1">
                    <p className="text-sm font-bold">Heading</p>
                    <p className="text-sm">{info?.heading || "-"}°</p>
                </div>
            </div>
        </div>
    );
};

export default HoveredTrafficTooltip;
