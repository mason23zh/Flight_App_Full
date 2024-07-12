import React from "react";
import { VatsimFlight } from "../../../../types";
import SearchBoxFlightElement from "./SearchBoxFlightElement";

interface Props {
    flights: VatsimFlight[];
}

const SearchBoxFlightDisplaySection = ({ flights }: Props) => {
    if (flights.length === 0) {
        return (
            <div>
                No Matched Flight
            </div>
        );
    } else {
        return (
            <div className="grid grid-cols-1 max-h-[500px] overflow-auto">
                {
                    flights.map((flight) => {
                        return (
                            <div key={flight.cid}>
                                <SearchBoxFlightElement flight={flight}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

};

export default SearchBoxFlightDisplaySection;