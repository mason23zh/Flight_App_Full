import React from "react";
import { GroupedFlight } from "../../../../types";

interface Props {
    aircraft: GroupedFlight;
}

const SearchBoxAircraftGroup = ({ aircraft }: Props) => {
    console.log("Aircraft by type:", aircraft);
    return (
        <div>
            {aircraft.aircraftType}
        </div>
    );
};

export default SearchBoxAircraftGroup;