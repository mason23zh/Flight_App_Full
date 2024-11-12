import React, { useRef } from "react";
import SearchBoxAirportElement from "./SearchBoxAirportElement";
import { LocalDbAirport } from "../../../../types";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface Props {
    airports: LocalDbAirport[];
}

const SearchBoxAirportDisplaySection = ({ airports }: Props) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [index: number]: number }>({});

    const setRowHeight = (index: number, size: number) => {
        listRef.current.resetAfterIndex(index);
        rowHeights.current = {
            ...rowHeights.current,
            [index]: size
        };
    };

    const getItemSize = (index: number) => {
        return rowHeights.current[index] || 82; // fallback value
    };

    const Row = ({
        index,
        style
    }) => (
        <div style={style}>
            <SearchBoxAirportElement
                airport={airports[index]}
                setRowHeight={setRowHeight}
                index={index}
            />
        </div>
    );

    if (airports.length === 0) {
        return <div>No Matched Airport</div>;
    }

    // 300px = 225pt
    // 500px = 375pt
    return (
        <div className="h-[225pt] sm:h-[375pt]">
            <AutoSizer>
                {({
                    height,
                    width
                }) => (
                    <List
                        height={height}
                        itemCount={airports.length}
                        itemSize={getItemSize}
                        width={width}
                        ref={listRef}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
};

export default SearchBoxAirportDisplaySection;