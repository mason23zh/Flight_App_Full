import React, { useRef } from "react";
import SearchBoxAirportElement from "./SearchBoxAirportElement";
import { LocalDbAirport } from "../../../../types";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface Props {
    airports: LocalDbAirport[];
}

const SearchBoxAirportDisplaySection = ({ airports }: Props) => {
    const listRef = useRef(null);
    const rowHeights = useRef({});

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

    return (
        <div className="h-[500px]">
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