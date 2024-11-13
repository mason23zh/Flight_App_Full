import React from "react";
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

    // 255pt = 300px
    // 375pt = 500px
    return (
        <div className="max-h-[70vh] h-[255pt] sm:h-[375pt] overflow-hidden">
            <Virtuoso
                className="h-full"
                data={flights}
                itemContent={(index, flight) => (
                    <TrafficDetailElement
                        index={index}
                        flight={flight}
                        isArrival={arrival}
                    />
                )}
            />
        </div>
    );
};

export default TrafficDetailList;