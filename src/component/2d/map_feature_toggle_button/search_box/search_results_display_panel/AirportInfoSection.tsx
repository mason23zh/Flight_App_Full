import React from "react";
import { LocalDbAirport } from "../../../../../types";
import { Panel } from "rsuite";
import AirportInfoDropDownPanel from "./AirportInfoDropDownPanel";

interface Props {
    airport: LocalDbAirport;
}

const AirportInfoSection = ({ airport }: Props) => {

    return (
        <div className="text-[16px]">
            <AirportInfoDropDownPanel airport={airport}/>
        </div>
    );
};

export default AirportInfoSection;