import React, { useEffect, useState } from "react";
import { VatsimFlight } from "../../../../../types";
import TrafficDetailElement from "./TrafficDetailElement";
import { Virtuoso } from "react-virtuoso";

// This component will render list of traffics that displayed in the
// AirportDepartureArrival Display component.
interface Props {
    flights: VatsimFlight[];
    arrival: boolean;
}

const TrafficDetailList = ({
    flights,
    arrival
}: Props) => {

    if (!flights || flights.length === 0) {
        return <div className="p-2">No Traffic</div>;
    }

    //max-h-[70vh] h-[255pt] sm:h-[375pt] overflow-hidden
    // 255pt = 300px
    // 375pt = 500px
    //h-[22rem] sm:h-[28rem]
    return (
        <div className="h-[22rem] sm:h-[28rem]">
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