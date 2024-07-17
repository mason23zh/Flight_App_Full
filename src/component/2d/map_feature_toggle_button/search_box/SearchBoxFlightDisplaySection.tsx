import React, { useRef, useState } from "react";
import { VatsimFlight } from "../../../../types";
import SearchBoxFlightElement from "./SearchBoxFlightElement";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface Props {
    flights: VatsimFlight[];
}

const SearchBoxFlightDisplaySection = ({ flights }: Props) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [index: number]: number }>({});
    const [selectedTraffic, setSelectedTraffic] = useState<VatsimFlight | null>(null);

    const setRowHeight = (index: number, size: number) => {
        listRef.current.resetAfterIndex(index);
        rowHeights.current = {
            ...rowHeights.current,
            [index]: size
        };
    };
    const getItemSize = (index: number) => {
        return rowHeights.current[index] || 65; // fallback value
    };

    const Row = ({
        index,
        style
    }) => (
        <div style={style}>
            <SearchBoxFlightElement
                flight={flights[index]}
                onSelect={handleOnSelect}
                isSelected={selectedTraffic?.cid === flights[index].cid}
                setRowHeight={setRowHeight}
                index={index}
            />
        </div>
    );


    const handleOnSelect = (flight: VatsimFlight) => {
        setSelectedTraffic(flight);
    };

    if (flights.length === 0) {
        return (
            <div>
                No Matched Flight
            </div>
        );
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
                        itemCount={flights.length}
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

export default SearchBoxFlightDisplaySection;