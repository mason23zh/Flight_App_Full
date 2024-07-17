import React, { useState } from "react";
import { LocalDbAirport } from "../../../../../types";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import AirportIdentDisplayBox from "./AirportIdentDisplayBox";
import AirportInfoExpandContent from "./AirportInfoExpandContent";


interface Props {
    airport: LocalDbAirport;
}

const AirportInfoDropDownPanel = ({ airport }: Props) => {
    const [expand, setExpand] = useState(false);

    const handleClick = () => {
        setExpand(prev => !prev);
    };

    return (
        <div
            onClick={handleClick}
            className="grid grid-cols-4 items-center font-Rubik hover:cursor-pointer">
            <div className="col-span-3 grid grid-cols-1 justify-self-start gap-1">
                <div className="text-[15px] pl-1">
                    {airport.name}
                </div>
                <div className="w-fit pl-1 justify-self-start">
                    <AirportIdentDisplayBox airport={airport}/>
                </div>
            </div>
            <div className="justify-self-end text-[25px]">
                {!expand ? <RiArrowDownSLine/> : <RiArrowUpSLine/>}
            </div>
            <div className="col-span-4 text-xs">
                {expand &&
                    <AirportInfoExpandContent airport={airport}/>
                }
            </div>
        </div>
    );
};

export default AirportInfoDropDownPanel;