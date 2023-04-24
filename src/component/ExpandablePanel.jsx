import React, { useState } from "react";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";

function ExpandablePanel({
    metar, weather, weatherData, children,
}) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="mb-2 border rounded">
            <div className="flex p-2 justify-between items-center w-auto h-auto">
                <div className="flex flex-col bg-gray-200 justify-center">
                    <div className="flex justify-between gap-20">
                        <div>ICAO</div>
                        <div>Airport Name</div>
                        <div>{weather.replace("_", " ")}</div>
                    </div>
                    <div className="flex gap-20">
                        <div>{metar.station_id}</div>
                        <div>{metar.name}</div>
                        <div>{weatherData}</div>
                    </div>
                </div>
                <div role="presentation" className="cursor-pointer" onClick={handleClick}>
                    {expanded ? <GoChevronDown /> : <GoChevronLeft />}
                </div>
            </div>
            {expanded && <div className="p-2 border-r">{children}</div>}
        </div>
    );
}

export default ExpandablePanel;
