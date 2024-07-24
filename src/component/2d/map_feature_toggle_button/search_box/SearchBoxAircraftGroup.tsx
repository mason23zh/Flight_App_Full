import React from "react";
import { GroupedFlight } from "../../../../types";
import { useDispatch } from "react-redux";
import {
    setAircraftListDisplay,
    setAirportDepartureArrivalDisplay,
    setMapSearchSelectedAircraft
} from "../../../../store";

interface Props {
    aircraft: GroupedFlight;
}

const SearchBoxAircraftGroup = ({ aircraft }: Props) => {
    const dispatch = useDispatch();
    // dispatch the all traffics with selected traffic
    const handleClick = () => {
        dispatch(setMapSearchSelectedAircraft(aircraft.flights));
        dispatch(setAircraftListDisplay(true));
        dispatch(setAirportDepartureArrivalDisplay(false));
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