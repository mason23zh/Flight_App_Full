import React, { useRef, useState } from "react";
import { VatsimFlight } from "../../../../types";
import SearchBoxFlightElement from "./SearchBoxFlightElement";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Virtuoso } from "react-virtuoso";

interface Props {
    flights: VatsimFlight[];
}

const SearchBoxFlightDisplaySection = ({ flights }: Props) => {
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [index: number]: number }>({});
    const [selectedTraffic, setSelectedTraffic] = useState<VatsimFlight | null>(null);

    // const setRowHeight = (index: number, size: number) => {
    //     listRef.current.resetAfterIndex(index);
    //     rowHeights.current = {
    //         ...rowHeights.current,
    //         [index]: size
    //     };
    // };
    // const getItemSize = (index: number) => {
    //     return rowHeights.current[index] || 65; // fallback value
    // };

    // const Row = ({
    //     index,
    //     style
    // }) => (
    //     <div style={{
    //         ...style,
    //         width: "100%"
    //     }}>
    //         <SearchBoxFlightElement
    //             flight={flights[index]}
    //             onSelect={handleOnSelect}
    //             isSelected={selectedTraffic?.cid === flights[index].cid}
    //             setRowHeight={setRowHeight}
    //             index={index}
    //         />
    //     </div>
    // );


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

    // 255pt = 300px
    // 375pt = 500px


    return (
        <Virtuoso
            style={{ height: "375pt" }}
            data={flights}
            itemContent={(index, flights) => (
                <SearchBoxFlightElement
                    flight={flights[index]}
                    onSelect={() => handleOnSelect(flights[index])}
                    isSelected={selectedTraffic?.cid === flights[index].cid}
                />
            )}

        />
    );

    // return (
    //     <div className="flex h-[60vh]">
    //         <div className="flex flex-auto">
    //             <AutoSizer>
    //                 {({
    //                     height,
    //                     width
    //                 }) => (
    //                     <List
    //                         height={height}
    //                         itemCount={flights.length}
    //                         itemSize={getItemSize}
    //                         width={width}
    //                         ref={listRef}
    //                     >
    //                         {Row}
    //                     </List>
    //                 )}
    //             </AutoSizer>
    //         </div>
    //     </div>
    // );

    // return (
    //     <div className="flex h-[50vh]">
    //         <AutoSizer>
    //             {({
    //                 height,
    //                 width
    //             }) => (
    //                 <List
    //                     height={height}
    //                     itemCount={flights.length}
    //                     itemSize={getItemSize}
    //                     width={width}
    //                     ref={listRef}
    //                 >
    //                     {Row}
    //                 </List>
    //             )}
    //         </AutoSizer>
    //     </div>
    // );
};

export default SearchBoxFlightDisplaySection;