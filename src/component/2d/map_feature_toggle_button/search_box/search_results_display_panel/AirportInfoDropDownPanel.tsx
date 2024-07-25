import React from "react";
import { LocalDbAirport } from "../../../../../types";
import AirportIdentDisplayBox from "./AirportIdentDisplayBox";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setAirportDepartureArrivalDisplay } from "../../../../../store";


interface Props {
    airport: LocalDbAirport;
}

const AirportInfoDropDownPanel = ({ airport }: Props) => {
    const dispatch = useDispatch();

    const handleCloseClick = () => {
        dispatch(setAirportDepartureArrivalDisplay(false));
    };

    return (
        <div
            className="grid grid-cols-4 items-center font-Rubik">
            <div className="col-span-3 grid grid-cols-1 justify-self-start gap-1">
                <div className="text-[15px] pl-1">
                    {airport.name}
                </div>
                <div className="w-fit pl-1 justify-self-start">
                    <AirportIdentDisplayBox airport={airport}/>
                </div>
            </div>
            <div
                onClick={handleCloseClick}
                className="justify-self-end text-[25px] hover:cursor-pointer">
                <IoMdCloseCircleOutline/>
            </div>
        </div>
    );
};

export default AirportInfoDropDownPanel;