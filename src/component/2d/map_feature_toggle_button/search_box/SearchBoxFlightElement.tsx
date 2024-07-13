import React from "react";
import { useDispatch } from "react-redux";
import { VatsimFlight } from "../../../../types";
import { setMapSearchSelectedTraffic } from "../../../../store";

interface Props {
    flight: VatsimFlight;
    onSelect: (flight: VatsimFlight) => void;
    isSelected: boolean;
}

const SearchBoxFlightElement = ({
    flight,
    onSelect,
    isSelected
}: Props) => {
    const dispatch = useDispatch();

    // Dispatch the flight data to be used in the MainTrafficLayer to trigger the Flight Info Panel
    const handleClick = () => {
        dispatch(setMapSearchSelectedTraffic(flight));
        onSelect(flight);
    };

    const theme = isSelected ? "p-2 grid grid-rows-2 hover:cursor-pointer " +
            "bg-gray-600 rounded-lg border-slate-400"
        : "p-2 grid grid-rows-2 hover:cursor-pointer " +
            "hover:bg-gray-400 hover:rounded-lg border-slate-400";

    return (
        <div
            onClick={handleClick}
            className={theme}
        >
            <div className="text-[16px]">
                {flight.callsign}
            </div>
            <div className="flex gap-1">
                <div>
                    {flight.flight_plan?.departure || "N/A"}
                </div>
                <div>
                    -
                </div>
                <div>
                    {flight.flight_plan?.arrival || "N/A"}
                </div>
                <div>
                    -
                </div>
                <div>
                    {flight.flight_plan?.aircraft_faa || "N/A"}
                </div>
            </div>
        </div>
    );
};

export default SearchBoxFlightElement;