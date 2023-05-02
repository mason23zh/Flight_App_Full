import React from "react";
import {
    HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp,
} from "react-icons/hi";
import { type } from "@testing-library/user-event/dist/type";


function ExpandableContentAirportInfo({ row, airportData }) {
    const { wind_dir_degrees, wind_speed_kt } = row.original;
    console.log(row.original);
    console.log(typeof wind_speed_kt);
    
    const renderWindComponentButtons = (windDegrees, windSpeed, runwayHdg) => {
        let crossWindButton;
        let headWindButton;
        const filteredWindSpeed = typeof windSpeed === "number" ? windSpeed : Number(windSpeed.replace(/[^0-9]/g, ""));
        const crossWind = Math.round(Math.sin(((Number(runwayHdg) - Number(windDegrees)) * (Math.PI / 180))) * filteredWindSpeed);
        const headWind = Math.round(Math.cos(((Number(runwayHdg) - Number(windDegrees)) * (Math.PI / 180))) * filteredWindSpeed);
        console.log(crossWind, headWind);
        if (crossWind <= 0) {
            crossWindButton = (
                <div className="flex justify-center items-center p-1 bg-green-400 rounded-xl">
                    <HiArrowNarrowLeft />
                    <div>
                        {-crossWind} kts
                    </div>
                </div>
            );
        } else if (crossWind > 0) {
            crossWindButton = (
                <div className="flex justify-center items-center p-1 bg-green-400 rounded-xl">
                    <HiArrowNarrowRight />
                    <div>
                        {crossWind} kts
                    </div>
                </div>
            );
        }
        
        
        if (headWind <= 0) {
            headWindButton = (
                <div className="flex justify-center items-center p-1 bg-red-400 rounded-xl">
                    <HiArrowNarrowUp />
                    <div>
                        {-headWind} kts
                    </div>
                </div>
            );
        } else if (headWind > 0) {
            headWindButton = (
                <div className="flex justify-center items-center p-1 bg-green-400 rounded-xl">
                    <HiArrowNarrowDown />
                    <div>
                        {headWind} kts
                    </div>
                </div>
            );
        }
        
        
        return (
            <div className="flex gap-1">
                <div>
                    {crossWindButton}
                </div>
                <div>
                    {headWindButton}
                </div>
            </div>
        );
    };
    
    const renderedRunways = airportData.runways.map((runway) => (
        <div key={runway._id} className="p-3 flex flex-col ">
            <div>
                Runway {runway.runway_id}
            </div>
            <div>
                Heading: {runway.runwayHdg}
            </div>
            <div>
                Length: {runway.runwayLength} ft
            </div>
            <div>
                Width: {runway.runwayWidth} ft
            </div>
            <div>
                ILS:
                {" "}
                {runway.runway_ils_avl === 0 ? "Not Available" : runway.ilsFreq}
            </div>
            <div>
                {runway.runway_ils_avl === 0 ? "" : `ILS Course: ${runway.ilsHdg}`}
            </div>
            {renderWindComponentButtons(wind_dir_degrees, wind_speed_kt, runway.runwayHdg)}
        </div>
    ));
    
    return (
        <div className="p-3 text-lg">
            <div className="flex flex-col justify-center items-center">
                <div>
                    Raw Metar: {row.original.raw_text}
                </div>
                <div>
                    Elevation: {airportData.elevation} ft
                </div>
                <div>
                    Transition Altitude: {airportData.transitionAltitude} ft
                </div>
            </div>
            <div className="grid grid-cols-2 justify-center justify-items-center ">
                {renderedRunways}
            </div>
        </div>
    );
}

export default ExpandableContentAirportInfo;
