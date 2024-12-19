import React from "react";

interface TelemetryElementProps {
    telemetryName: string;
    telemetryData: number;
    telemetryUnit: string;
}

const TelemetryElement = ({
    telemetryName,
    telemetryData,
    telemetryUnit
}: TelemetryElementProps) => {
    return (
        <div className="px-2 py-1 w-full grid grid-rows-2 justify-center
        bg-gray-500 text-gray-100 rounded-lg items-center">
            <div className="text-xs">{telemetryName}</div>
            <div className="justify-self-center">
                <div className="flex items-center gap-1 text-sm font-bold">
                    <div>{telemetryData}</div>
                    <div>{telemetryUnit}</div>
                </div>
            </div>
        </div>
    );
};

export default TelemetryElement;