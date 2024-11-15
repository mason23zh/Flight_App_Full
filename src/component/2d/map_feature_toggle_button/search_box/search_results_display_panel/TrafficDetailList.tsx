import React from "react";
import { VatsimFlight } from "../../../../../types";
import TrafficDetailElement from "./TrafficDetailElement";
import { Virtuoso } from "react-virtuoso";

// This component will render list of traffics that displayed in the
// AirportDepartureArrival Display component.
interface Props {
    flights: VatsimFlight[];
    arrival: boolean;
    containerHeight: number;
}

const TrafficDetailList = ({
    flights,
    arrival,
    containerHeight

}: Props) => {

    if (!flights || flights.length === 0) {
        return <div className="p-2">No Traffic</div>;
    }

    return (
        <div style={{ maxHeight: `${containerHeight - 3}rem` }}>
            <Virtuoso
                // className="h-full"
                style={{ height: "100%" }}
                data={flights}
                itemContent={(_, flight) => (
                    <TrafficDetailElement
                        flight={flight}
                        isArrival={arrival}
                    />
                )}
            />
        </div>
    );
};

export default TrafficDetailList;