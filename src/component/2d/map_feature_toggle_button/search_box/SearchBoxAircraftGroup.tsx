import React from "react";
import { GroupedFlight } from "../../../../types";
import { useDispatch } from "react-redux";
import {
    openSearchResults, openTrafficDetail,
    setAircraftListDisplay,
    setAirportDepartureArrivalDisplay, setFilterAircraftOnMap_aircraft, setFilterAircraftOnMap_airport,
    setMapSearchSelectedAircraft, setSelectedAircraftCategory,
} from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";

interface Props {
    aircraft: GroupedFlight;
}

const SearchBoxAircraftGroup = ({ aircraft }: Props) => {
    const dispatch = useDispatch();
    const handleClick = () => {
        // display selected traffic on map
        dispatch(setFilterAircraftOnMap_aircraft(true));
        // remove other filter if they are set
        dispatch(setFilterAircraftOnMap_airport(false));
        // dispatch traffic to be displayed on the map and to the aircraft lis display
        dispatch(setMapSearchSelectedAircraft(aircraft.flights));
        // display the traffic display
        dispatch(setAircraftListDisplay(true));
        // close other panel if they are open
        dispatch(setAirportDepartureArrivalDisplay(false));
        //dispatch the traffic type to be used in the useLiveQuery in BaseTrafficLayer
        dispatch(setSelectedAircraftCategory(aircraft.aircraftType));
        // close the search box
        dispatch(toggleSearchBox(false));
        // dispatch the search panel type to mapDisplayPanel slice,
        // this will help re-open the search results panel if required.
        dispatch(openSearchResults("AIRCRAFT"));
    };

    return (
        <div
            onClick={handleClick}
            className="font-Rubik grid grid-cols-4 gap-2
        items-center w-full border-b p-1 hover:bg-gray-400 hover:cursor-pointer">
            <div className="col-span-1">
                {aircraft.aircraftType}
            </div>
            <div className="col-span-2">
                {aircraft.flights[0].flight_plan?.aircraft_name || "-"}
            </div>
            <div className="flex gap-1 col-span-1">
                <div>Online:</div>
                <div>{aircraft.flights.length}</div>
            </div>
        </div>
    );
};

export default SearchBoxAircraftGroup;