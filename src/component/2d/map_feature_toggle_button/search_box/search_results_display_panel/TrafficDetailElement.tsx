import React, { useEffect, useRef, useState } from "react";
import { VatsimFlight } from "../../../../../types";
import { searchAirportByIdent } from "../mapSearchFunction";
import distanceInKmBetweenEarthCoordinates from "../../../../../util/coordinatesDistanceCalculator";
import FlightStatusFlag from "../../../detail_flight_info_panel/FlightStatusFlag";

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
    const [toGoDistance, setToGoDistance] = useState(-1);
    const [totalDistance, setTotalDistance] = useState(0);
    const [progress, setProgress] = useState(-1);

    useEffect(() => {
        const departureAirportIdent = flight?.flight_plan?.departure || "";
        const arrivalAirportIdent = flight?.flight_plan?.arrival || "";
        (async () => {
            const depAirport = await searchAirportByIdent(departureAirportIdent);
            const arrAirport = await searchAirportByIdent(arrivalAirportIdent);
            if (depAirport && arrAirport) {
                const arrivalAirportCoord = arrAirport[0].coordinates;
                const departureAirportCoord = depAirport[0].coordinates;
                const [dLon, dLat] = departureAirportCoord.split(",");
                const [aLon, aLat] = arrivalAirportCoord.split(",");
                const total = Math.round(distanceInKmBetweenEarthCoordinates(
                    Number(dLat), Number(dLon), Number(aLat), Number(aLon)
                ) * 0.539957);
                const toGo = Math.round(
                    distanceInKmBetweenEarthCoordinates(
                        flight.latitude, flight.longitude, Number(aLat), Number(aLon)) * 0.539957
                );
                const progress = Math.round((1 - (toGo / total)) * 100);
                setToGoDistance(total);
                setTotalDistance(toGo);
                setProgress(progress);
            }
        })();
    }, [flight]);

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    return (
        <div
            ref={rowRef}
            className="bg-gray-500 grid-cols-1 p-1 border-b border-slate-400 rounded-lg"
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
                {toGoDistance === -1 ? "" : `${toGoDistance} nm`}
            </div>
            <FlightStatusFlag progress={progress}/>
        </div>
    );
};

export default TrafficDetailElement;