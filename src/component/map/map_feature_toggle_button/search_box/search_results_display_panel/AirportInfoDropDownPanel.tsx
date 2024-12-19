import React from "react";
import { LocalDbAirport } from "../../../../../types";
import AirportIdentDisplayBox from "./AirportIdentDisplayBox";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
    closeSearchResults,
    setAirportDepartureArrivalDisplay,
    setFilterAircraftOnMap_airport,
    setMapSearchSelectedAirport
} from "../../../../../store";

interface Props {
    airport: LocalDbAirport;
}

const AirportInfoDropDownPanel = ({ airport }: Props) => {
    const dispatch = useDispatch();

    const handleCloseClick = () => {
        // close the airport departure arrival display panel
        dispatch(setAirportDepartureArrivalDisplay(false));
        // remove the filter so traffic display on the map will reset
        dispatch(setFilterAircraftOnMap_airport(false));
        // remove selected airport from redux to make sure traffic display on the map reset
        dispatch(setMapSearchSelectedAirport(null));
        //close the search result list
        dispatch(closeSearchResults());
    };

    return (
        <div
            className="grid grid-cols-4 items-center">
            <div className="col-span-3 grid grid-cols-1 justify-self-start gap-1">
                <div className="text-[15px] pl-1">
                    {airport?.name || "N/A"}
                </div>
                <div className="w-fit pl-1 justify-self-start">
                    <AirportIdentDisplayBox airport={airport}/>
                </div>
            </div>
            <div
                onClick={handleCloseClick}
                className="justify-self-end text-[25px] hover:cursor-pointer hover:text-gray-700">
                <IoMdCloseCircleOutline/>
            </div>
        </div>
    );
};

export default AirportInfoDropDownPanel;