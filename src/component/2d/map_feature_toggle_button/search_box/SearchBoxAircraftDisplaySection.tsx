import React from "react";
import { GroupedFlight } from "../../../../types";
import SearchBoxAircraftElement from "./SearchBoxAircraftElement";

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
        <div className="grid grid-cols-1 max-h-[500px] overflow-auto">
            {
                aircrafts.map((aircraft) => {
                    return (
                        <div key={aircraft.aircraftType}>
                            <SearchBoxAircraftElement aircraft={aircraft}/>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default SearchBoxAircraftDisplaySection;