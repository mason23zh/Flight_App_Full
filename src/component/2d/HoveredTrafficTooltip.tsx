import React from "react";
import { VatsimFlight } from "../../types";

interface HoveredTrafficTooltipProps {
    info: VatsimFlight;
}

const HoveredTrafficTooltip = ({ info }: HoveredTrafficTooltipProps) => {
    return (
        <div className="w-64 rounded-lg bg-gray-900 p-4 text-white shadow-md">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-lg font-bold text-blue-500">CAA123</p>
                <p className="text-sm text-gray-400">B77W</p>
            </div>

            <hr className="my-2 border-gray-700"/>


            <div className="mb-4 grid grid-cols-3 items-center gap-3">
                <div className="text-center">
                    <p className="text-sm font-bold">EGLL</p>
                    <p className="text-xs text-gray-400">London asdfasdf asdf</p>
                </div>

                <hr className="my-5 border-gray-700"/>

                <div className="text-center">
                    <p className="text-sm font-bold">EGKK</p>
                    <p className="text-xs text-gray-400">Frankfurt</p>
                </div>
            </div>


            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded bg-gray-800 p-2">
                    <p className="text-sm font-bold">GS</p>
                    <p className="text-sm">420 kts</p>
                </div>

                <div className="rounded bg-gray-800 p-2">
                    <p className="text-sm font-bold">Altitude</p>
                    <p className="text-sm">20000 ft</p>
                </div>

                <div className="rounded bg-gray-800 p-2">
                    <p className="text-sm font-bold">Heading</p>
                    <p className="text-sm">050°</p>
                </div>
            </div>
        </div>


    );
};

export default HoveredTrafficTooltip;