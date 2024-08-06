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
        <div className="grid grid-cols-1 h-[300px] sm:min-h-[500px] overflow-auto">
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