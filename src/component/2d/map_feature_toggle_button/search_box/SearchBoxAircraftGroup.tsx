import React from "react";
import { GroupedFlight } from "../../../../types";

interface Props {
    aircraft: GroupedFlight;
}

const SearchBoxAircraftGroup = ({ aircraft }: Props) => {
    console.log("Aircraft by type:", aircraft);
    return (
        <div className="grid grid-cols-4 items-center w-full border-b p-1">
            <div className="col-span-1">
                {aircraft.aircraftType}
            </div>
            <div className="col-span-2">
                {aircraft.flights[0].flight_plan?.aircraft_name || "-"}
            </div>
            <div className="flex gap-1 col-span-1">
                <div>{aircraft.flights.length}</div>
                <div>Online</div>
            </div>
        </div>
    );
};

export default SearchBoxAircraftGroup;