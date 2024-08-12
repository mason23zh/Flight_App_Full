import React from "react";
import { GroupedFlight } from "../../../../types";
import SearchBoxAircraftGroup from "./SearchBoxAircraftGroup";

interface Props {
    aircrafts: GroupedFlight[];
}

const SearchBoxAircraftDisplaySection = ({ aircrafts }: Props) => {
    if (aircrafts.length === 0) {
        return (
            <div>
                No Matched Aircraft
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[300px] sm:h-[500px]
        items-center gap-2 p-1 overflow-y-auto">
            {
                aircrafts.map((aircraft) => {
                    return (
                        <div key={aircraft.aircraftType}>
                            <SearchBoxAircraftGroup aircraft={aircraft}/>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default SearchBoxAircraftDisplaySection;