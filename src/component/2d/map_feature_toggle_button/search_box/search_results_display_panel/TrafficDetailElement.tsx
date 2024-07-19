import React, { useEffect, useRef, useState } from "react";
import { VatsimFlight } from "../../../../../types";
import { searchAirportByIdent } from "../mapSearchFunction";
import distanceInKmBetweenEarthCoordinates from "../../../../../util/coordinatesDistanceCalculator";
import calculateArrivalTime from "../../../../../util/calculateArrivalTime";
import { useDispatch } from "react-redux";
import { setAirportDepartureArrivalDisplay, setMapSearchSelectedTraffic } from "../../../../../store";

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
    const [toGoDistance, setToGoDistance] = useState(-1);

    useEffect(() => {
        const arrivalAirportIdent = flight?.flight_plan?.arrival || "";
        (async () => {
            const arrAirport = await searchAirportByIdent(arrivalAirportIdent);
            if (arrAirport) {
                const arrivalAirportCoord = arrAirport[0].coordinates;
                const [aLon, aLat] = arrivalAirportCoord.split(",");
                const toGo = Math.round(
                    distanceInKmBetweenEarthCoordinates(
                        flight.latitude, flight.longitude, Number(aLat), Number(aLon)) * 0.539957
                );
                setToGoDistance(toGo);
            }
        })();
    }, [flight]);

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    const ETA = (flight?.flight_plan?.deptime && flight?.flight_plan?.enroute_time) ?
        calculateArrivalTime(flight.flight_plan.deptime, flight.flight_plan.enroute_time) : -1;

    const handleOnClick = () => {
        dispatch(setAirportDepartureArrivalDisplay(false));
        dispatch(setMapSearchSelectedTraffic(flight));
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
                    {toGoDistance !== -1 ? (
                        <div>
                            {toGoDistance}NM remains
                        </div>
                    ) : "-"
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