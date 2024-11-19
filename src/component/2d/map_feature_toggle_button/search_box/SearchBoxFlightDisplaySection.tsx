import React, { useState } from "react";
import { VatsimFlight } from "../../../../types";
import SearchBoxFlightElement from "./SearchBoxFlightElement";
import { Virtuoso } from "react-virtuoso";

interface Props {
    flights: VatsimFlight[];
}

// To render traffic list.
// This component will be used in both Search Box results and AircraftDisplay panel

const SearchBoxFlightDisplaySection = ({ flights }: Props) => {
    const [selectedTraffic, setSelectedTraffic] = useState<VatsimFlight | null>(null);

    const handleOnSelect = (flight: VatsimFlight) => {
        setSelectedTraffic(flight);
    };

    if (flights.length === 0) {
        return (
            <div>
                No Matched Flight
            </div>
        );
    }

    // 255pt = 300px
    // 375pt = 500px
    // 217.5pt = 290px
    // 262.5 pt = 350px

    return (
        <div className="flex-1 h-full">
            <Virtuoso
                data={flights}
                style={{ height: "100%" }}
                itemContent={(_, flight) => (
                    <SearchBoxFlightElement
                        flight={flight}
                        onSelect={() => handleOnSelect(flight)}
                        isSelected={selectedTraffic?.cid === flight.cid}
                    />
                )}

            />
        </div>
    );
};

export default SearchBoxFlightDisplaySection;