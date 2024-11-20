import React, { forwardRef, useRef } from "react";
import SearchBoxAirportElement from "./SearchBoxAirportElement";
import { LocalDbAirport } from "../../../../types";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Virtuoso } from "react-virtuoso";

interface Props {
    airports: LocalDbAirport[];
}

const SearchBoxAirportDisplaySection = ({ airports }: Props) => {

    if (airports.length === 0) {
        return <div>No Matched Airport</div>;
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
                data={airports}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, airport) => (
                    <SearchBoxAirportElement
                        airport={airport}
                        // index={index}
                    />
                )}
            />
        </div>
    );
};

export default SearchBoxAirportDisplaySection;