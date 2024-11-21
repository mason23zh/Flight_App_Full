import React from "react";
import { VatsimFlight } from "../../../../../types";
import TrafficDetailElement from "./TrafficDetailElement";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../../../../../util/VirtuosoScroller";

/*
* This component will render list of traffics that displayed in the
* AirportDepartureArrival Display component.
* */

interface Props {
    flights: VatsimFlight[];
    arrival: boolean;
}

const TrafficDetailList = ({
    flights,
    arrival,

}: Props) => {


    if (!flights || flights.length === 0) {
        return <div className="p-2 text-center text-lg">No Traffic</div>;
    } else {
        return (
            <div className="flex-1 h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-600">
                <Virtuoso
                    components={{ Scroller }}
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
    }
};

export default TrafficDetailList;