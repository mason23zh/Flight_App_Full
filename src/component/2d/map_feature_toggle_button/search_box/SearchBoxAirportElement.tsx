import React, { useEffect, useRef } from "react";
import { LocalDbAirport } from "../../../../types";
import { useDispatch } from "react-redux";
import {
    openSearchResults, setFilterAircraftOnMap_aircraft,
    setFilterAircraftOnMap_airport,
    setMapSearchSelectedAirport, setTrafficTracking
} from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import { useMap } from "react-map-gl";

interface Props {
    airport: LocalDbAirport;
    setRowHeight: (index: number, size: number) => void; //to send back the height to parent component
    index: number;
}


const SearchBoxAirportElement = ({
    airport,
    setRowHeight,
    index
}: Props) => {
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();
    const rowRef = useRef<HTMLDivElement>();
    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    const handleOnClick = () => {
        // dispatch selected airport data to airport arrival panel
        dispatch(setMapSearchSelectedAirport(airport));
        // close the search box
        dispatch(toggleSearchBox(false));
        //remove other filter if they are set
        dispatch(setFilterAircraftOnMap_aircraft(false));
        // filter traffic on the map
        dispatch(setFilterAircraftOnMap_airport(true));
        // Open search result list
        dispatch(openSearchResults("AIRPORT"));
        // make sure the flight tracking is off
        dispatch(setTrafficTracking(false));
        // move the map to the airport
        // dispatch(setAirportTracking(true));
        if (mapRef) {
            const map = mapRef?.getMap();
            if (map) {
                map.flyTo({
                    center: [Number(airport.coordinates.split(",")[0]), Number(airport.coordinates.split(",")[1])],
                    zoom: 13
                });
            }
        }
    };

    return (
        <>
            <div
                onClick={handleOnClick}
                ref={rowRef}
                className="p-2 grid grid-rows-2 hover:cursor-pointer
                       hover:bg-gray-600 hover:rounded-lg border-b
                       border-slate-400"
            >
                <div className="flex items-center text-[16px]">
                    <div>
                        {airport.ident}
                    </div>
                    {
                        airport.iata_code && (
                            <div>
                                            &nbsp;/&nbsp;{airport.iata_code}
                            </div>
                        )
                    }
                </div>
                <div className="text-sm w-auto">
                    {airport.name && <div>{airport.name}</div>}
                </div>
            </div>
        </>
    );
};

export default SearchBoxAirportElement;