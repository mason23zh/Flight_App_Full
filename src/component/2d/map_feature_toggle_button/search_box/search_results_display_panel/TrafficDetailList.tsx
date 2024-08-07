import React, { useRef } from "react";
import { VatsimFlight } from "../../../../../types";
import { VariableSizeList as List } from "react-window";
import TrafficDetailElement from "./TrafficDetailElement";
import AutoSizer from "react-virtualized-auto-sizer";


interface Props {
    flights: VatsimFlight[];
    arrival: boolean;
}

const TrafficDetailList = ({
    flights,
    arrival
}: Props) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [index: number]: number }>({});

    if (!flights || flights.length === 0) {
        return <div className="p-2">No Traffic</div>;
    }

    const setRowHeight = (index: number, size: number) => {
        listRef.current.resetAfterIndex(index);
        rowHeights.current = {
            ...rowHeights.current,
            [index]: size
        };
    };

    const getItemSize = (index: number) => {
        return rowHeights.current[index] || 70; // fallback value
    };

    const Row = ({
        index,
        style
    }) => (
        <div style={style}>
            <TrafficDetailElement
                index={index}
                setRowHeight={setRowHeight}
                flight={flights[index]}
                isArrival={arrival}
            />
        </div>
    );


    // const status = from ? "from" : "to";
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

export default TrafficDetailList;