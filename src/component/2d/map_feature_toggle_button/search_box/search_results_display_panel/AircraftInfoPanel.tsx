import React, { useState } from "react";
import { VatsimFlight } from "../../../../../types";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setAircraftListDisplay, setFilterAircraftOnMap, setMapSearchSelectedAircraft } from "../../../../../store";

interface Props {
    aircraft: VatsimFlight[] | null;
}

const AircraftInfoPanel = ({ aircraft }: Props) => {
    const [filter, setFilter] = useState(false);
    const dispatch = useDispatch();

    if (!aircraft) return <></>;

    const handClick = () => {
        dispatch(setAircraftListDisplay(false));
    };

    const handleFilterClick = () => {
        setFilter(prev => !prev);
        dispatch(setFilterAircraftOnMap(filter));
        dispatch(setMapSearchSelectedAircraft(aircraft));
    };

    return (
        <div className="grid grid-cols-1 p-2 border-b">
            <div className="grid grid-cols-4 font-Rubik">
                <div className="col-span-3">
                    <div className="font-bold text-lg">
                        {aircraft[0]?.flight_plan.aircraft_short || "N/A"}
                    </div>
                    <div className="text-sm italic font-bold">
                        {aircraft[0]?.flight_plan?.aircraft_name || ""}
                    </div>
                </div>
                <div
                    onClick={handClick}
                    className="justify-self-end text-[19px] hover:cursor-pointer"
                >
                    <IoMdCloseCircleOutline/>
                </div>
            </div>
            <div
                onClick={handleFilterClick}
                className="hover:cursor-pointer"
            >
                Filter
            </div>
        </div>
    );
};

export default AircraftInfoPanel;