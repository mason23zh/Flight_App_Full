import React from "react";
import {
    HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp,
} from "react-icons/hi";
import { type } from "@testing-library/user-event/dist/type";


function ExpandableContentAirportInfo({ row, airportData }) {
    const { degrees, speed_kts } = row.original.wind;
    console.log("ORIGINAL ROW:", row.original);
    // console.log("WIND_DIR", wind_dir_degrees, wind_speed_kt);
    console.log(degrees, speed_kts);
    
    const toRadians = (angle) => angle * (Math.PI / 180);
    
    const renderWindComponentButtons = (windDegrees, windSpeed, runwayHdg) => {
        let crossWindButton;
        let headWindButton;
        const filteredWindSpeed = typeof windSpeed === "number" ? windSpeed : Number(windSpeed.replace(/[^0-9]/g, ""));
        const crossWind = Math.round(Math.sin(toRadians(Number(runwayHdg) - Number(windDegrees))) * filteredWindSpeed);
        const headWind = Math.round(Math.cos(toRadians(Number(runwayHdg) - Number(windDegrees))) * filteredWindSpeed);
        
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
            <div className="flex gap-2">
                <div>
                    {crossWindButton}
                </div>
                <div>
                    {headWindButton}
                </div>
            </div>
        );
    };
    console.log("Airport data:::::", airportData);
    
    const renderedRunways = airportData[0].runways.map((runways) => (
        <div key={runways.id} className="p-3 flex flex-col ">
            <div>
                Runway {runways.runway_id}
            </div>
            <div>
                Heading: {runways.runwayHdg}
            </div>
            <div>
                Length: {runways.runwayLength} ft
            </div>
            <div>
                Width: {runways.runwayWidth} ft
            </div>
            <div>
                ILS:
                {" "}
                {runways.runway_ils_avl === 0 ? "Not Available" : runways.ilsFreq}
            </div>
            <div>
                {runways.runway_ils_avl === 0 ? "" : `ILS Course: ${runways.ilsHdg}`}
            </div>
            <div>
                {runways.gsAngle ? `GS Angle: ${runways.gsAngle}${"\u00b0"}` : ""}
            </div>
            <div>
                {runways.thresholdOverflyAlt ? `TCH: ${runways.thresholdOverflyAlt} ft` : ""}
            </div>
            <div>
                {runways.thresholdElevation ? `Elevation: ${runways.thresholdElevation} ft` : ""}
            </div>
            {renderWindComponentButtons(degrees, speed_kts, runways.runwayHdg)}
        </div>
    ));
    
    return (
        <div className="p-3 text-lg">
            <div className="flex flex-col justify-center items-center">
                <div>
                    {row.original.raw_text}
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
