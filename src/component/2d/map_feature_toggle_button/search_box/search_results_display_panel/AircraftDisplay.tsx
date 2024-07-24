import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import AircraftInfoPanel from "./AircraftInfoPanel";
import SearchBoxFlightDisplaySection from "../SearchBoxFlightDisplaySection";

const AircraftDisplay = () => {
    const { selectedAircraftType } = useSelector((state: RootState) => state.mapSearchAircraft);

    const style = "text-white bg-gray-500 z-[200] absolute left-1/2 top-0 translate-x-[-50%] " +
            "translate-y-[5%] max-w-[290px] min-w-[290px] sm:right-5 " +
            "sm:left-auto sm:translate-x-[0] sm:translate-y-[5%] sm:max-w-[350px] sm:min-w-[350px]";


    return (
        <div className={style}>
            <div>
                <AircraftInfoPanel
                    aircraft={selectedAircraftType.length ? selectedAircraftType[0] : null}
                />
            </div>
            <div>
                <SearchBoxFlightDisplaySection flights={selectedAircraftType}/>
            </div>
        </div>
    );
};

export default AircraftDisplay;