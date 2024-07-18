import React from "react";
import { LocalDbAirport } from "../../../../../types";
import { FaInfoCircle } from "react-icons/fa";

interface Props {
    airport: LocalDbAirport;
    onClickExpand: () => void;
}

const AirportIdentDisplayBox = ({
    airport,
    onClickExpand
}: Props) => {
    return (
        <div
            onClick={onClickExpand}
            className="flex gap-2 hover:cursor-pointer">
            <div
                className="flex items-center gap-1 border-[1px] text-xs font-Rubik rounded-lg px-1 py-0"
            >
                <div>
                    {airport.iata_code || "-"}
                </div>
                <div>/</div>
                <div className="font-bold">
                    {airport.ident || "-"}
                </div>
            </div>
            <FaInfoCircle/>
        </div>
    );
};

export default AirportIdentDisplayBox;