import React, { useEffect, useState } from "react";
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

    console.log("container height:", containerHeight);

    //max-h-[70vh] h-[255pt] sm:h-[375pt] overflow-hidden
    // 255pt = 300px
    // 375pt = 500px
    //h-[22rem] sm:h-[28rem] style={{ height: containerHeight }}
    return (
        <div style={{ height: `${containerHeight - 3}rem` }}>
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