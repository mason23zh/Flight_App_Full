import React, { forwardRef } from "react";
import { GroupedFlight } from "../../../../types";
import SearchBoxAircraftGroup from "./SearchBoxAircraftGroup";
import { Virtuoso } from "react-virtuoso";

interface Props {
    aircrafts: GroupedFlight[];
}

//TODO: TypeScript issues
//This component will render list of aircraft and number of online in the search box
const SearchBoxAircraftDisplaySection = ({ aircrafts }: Props) => {
    if (aircrafts.length === 0) {
        return (
            <div>
                No Matched Aircraft
            </div>
        );
    }

    const Scroller = forwardRef(({
        ...props
    }, ref) => {
        return <div style={{}} ref={ref} {...props}
            className="scrollbar scrollbar-thin scrollbar-thumb-slate-700
            scrollbar-track-gray-500"
        />;
    });

    return (
        <div className="flex-1 h-full">
            <Virtuoso
                data={aircrafts}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, aircraft) => (
                    <SearchBoxAircraftGroup aircraft={aircraft}/>
                )}
            />
        </div>
    );
};

export default SearchBoxAircraftDisplaySection;