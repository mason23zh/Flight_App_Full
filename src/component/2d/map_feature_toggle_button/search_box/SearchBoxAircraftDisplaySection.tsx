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

    // 255pt = 300px
    // 375pt = 500px
    return (
        <div className="flex flex-col h-[255pt] sm:h-[375pt]
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