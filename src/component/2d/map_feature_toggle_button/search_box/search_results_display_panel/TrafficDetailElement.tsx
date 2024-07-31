import React, { useEffect, useMemo, useRef } from "react";
import { VatsimFlight } from "../../../../../types";
import calculateArrivalTime from "../../../../../util/calculateArrivalTime";
import { useDispatch } from "react-redux";
import {
    openTrafficDetail,
    setMapSearchSelectedTraffic,
    setSelectedTraffic,
    setTrafficTracking
} from "../../../../../store";

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
    const dispatch = useDispatch();
    const rowRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    const ETA = useMemo(() => {
        if (flight?.flight_plan?.deptime && flight?.flight_plan?.enroute_time) {
            return calculateArrivalTime(flight.flight_plan.deptime, flight.flight_plan.enroute_time);
        }
        return -1;
    }, [flight]);


    const handleOnClick = () => {
        // dispatch the traffic
        dispatch(setMapSearchSelectedTraffic(flight));
        dispatch(setSelectedTraffic(flight));
        //open traffic detail, this action will also close search result list
        dispatch(openTrafficDetail());
        dispatch(setTrafficTracking(true));
    };

    return (
        <div
            ref={rowRef}
            onClick={handleOnClick}
            className="bg-gray-500 grid-cols-1 p-1 border-b border-slate-400
            rounded-lg hover:cursor-pointer hover:bg-gray-600"
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
                <div>
                    &bull;
                </div>
                <div className="font-bold text-[14px]">
                    {isArrival ?
                        flight?.flight_plan?.departure :
                        flight?.flight_plan?.arrival
                    }
                </div>
                <div>
                    &bull;
                </div>
                <div>
                    {ETA !== -1 ? (
                        <div>ETA {ETA} Zulu</div>
                    ) : "-"
                    }
                </div>

            </div>
        </div>
    );
};

export default TrafficDetailElement;