import React from "react";
import { useDispatch } from "react-redux";
import { VatsimFlight } from "../../../../types";
import {
    openTrafficDetail,
    setAircraftListDisplay,
    setAirportDepartureArrivalDisplay, setAirportTracking,
    setMapSearchSelectedTraffic, setSelectedTraffic
} from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import { useMap } from "react-map-gl";

interface Props {
    flight: VatsimFlight;
    onSelect: (flight: VatsimFlight) => void;
    isSelected: boolean;
}

const SearchBoxFlightElement = ({
    flight,
    onSelect,
    isSelected,
}: Props) => {
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();

    // Dispatch the flight data to be used in the MainTrafficLayer to trigger the Flight Info Panel
    const handleClick = () => {
        dispatch(setMapSearchSelectedTraffic(flight));
        dispatch(setAircraftListDisplay(false));
        dispatch(setAirportDepartureArrivalDisplay(false));
        dispatch(openTrafficDetail());
        dispatch(toggleSearchBox(false));
        // make sure airport tracking is off
        dispatch(setAirportTracking(false));
        // set selected traffic to current traffic and move the map focus on this traffic
        dispatch(setSelectedTraffic(flight));
        // dispatch(setTrafficTracking(true)); 
        if (mapRef) {
            const map = mapRef?.getMap();
            if (map) {
                map.flyTo({
                    center: [flight.longitude, flight.latitude],
                    zoom: 10
                });
            }
        }
        onSelect(flight);
    };


    const theme = isSelected ? "p-2 grid grid-rows-2 hover:cursor-pointer " +
            "bg-gray-600 rounded-lg border-slate-400 border-b border-slat-400"
        : "p-2 grid grid-rows-2 hover:cursor-pointer " +
            "hover:bg-gray-400 hover:rounded-lg border-slate-400 border-b border-slat-400";

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