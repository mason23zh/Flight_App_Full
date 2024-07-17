import React from "react";
import { LocalDbAirport } from "../../../../../types";

interface Props {
    airport: LocalDbAirport;
}

const AirportIdentDisplayBox = ({ airport }: Props) => {
    return (
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
    );
};

export default AirportIdentDisplayBox;