import React from "react";
import { VatsimFlight } from "../../../../../types";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setAircraftListDisplay } from "../../../../../store";

interface Props {
    aircraft: VatsimFlight | null;
}

const AircraftInfoPanel = ({ aircraft }: Props) => {
    const dispatch = useDispatch();

    if (!aircraft) return <></>;

    const handClick = () => {
        dispatch(setAircraftListDisplay(false));
    };

    return (
        <div className="grid grid-cols-4 font-Rubik p-2 border-b">
            <div className="col-span-3">
                <div className="font-bold text-lg">
                    {aircraft?.flight_plan.aircraft_short || "N/A"}
                </div>
                <div className="text-sm italic font-bold">
                    {aircraft?.flight_plan?.aircraft_name || ""}
                </div>
            </div>
            <div
                onClick={handClick}
                className="justify-self-end text-[19px] hover:cursor-pointer"
            >
                <IoMdCloseCircleOutline/>
            </div>
        </div>
    );
};

export default AircraftInfoPanel;