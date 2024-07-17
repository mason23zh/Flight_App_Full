import React, { useEffect, useRef } from "react";
import { VatsimFlight } from "../../../../../types";

interface Props {
    setRowHeight: (index: number, size: number) => void;
    index: number;
    flight: VatsimFlight;
    isArrival: boolean;
}

const TrafficDetailElement = ({
    setRowHeight,
    index,
    flight,
    isArrival
}: Props) => {
    const rowRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    return (
        <div
            ref={rowRef}
            className="bg-gray-400 grid-cols-1 p-1 border-b border-slate-500"
        >
            <div className="flex gap-2 font-Rubik font-bold">
                <div>
                    {flight.callsign}
                </div>
                <div className="font-medium">|</div>
                <div>
                    {flight?.flight_plan?.aircraft_faa || "-"}
                </div>

            </div>
            <div className="flex items-center gap-2">
                <div>
                    {isArrival ? "from" : "to"}
                </div>
                <div className="font-bold text-[14px]">
                    {isArrival ?
                        flight?.flight_plan?.departure :
                        flight?.flight_plan?.arrival
                    }
                </div>
            </div>
        </div>
    );
};

export default TrafficDetailElement;