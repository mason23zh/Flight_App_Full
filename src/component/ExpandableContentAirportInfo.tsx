// Expand information when click 'detail' button on Extreme weather table
import React from "react";
import {
    HiArrowNarrowDown, HiArrowNarrowLeft, HiArrowNarrowRight, HiArrowNarrowUp,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAirportICAO } from "../store";
import { useTheme } from "../hooks/ThemeContext";

function ExpandableContentAirportInfo({
    row,
    airportData
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const darkMode = useTheme();

    const bgGreenColor = darkMode ? "bg-green-600" : "bg-green-400";
    const bgRedColor = darkMode ? "bg-red-600" : "bg-red-400";

    const {
        degrees,
        speed_kts
    } = row.wind;

    const toRadians = (angle) => angle * (Math.PI / 180);

    const renderWindComponentButtons = (windDegrees, windSpeed, runwayHdg) => {
        let crossWindButton;
        let headWindButton;
        const filteredWindSpeed = typeof windSpeed === "number" ? windSpeed : Number(windSpeed.replace(/[^0-9]/g, ""));
        const crossWind = Math.round(Math.sin(toRadians(Number(runwayHdg) - Number(windDegrees))) * filteredWindSpeed);
        const headWind = Math.round(Math.cos(toRadians(Number(runwayHdg) - Number(windDegrees))) * filteredWindSpeed);

        if (crossWind <= 0) {
            crossWindButton = (
                <div className={`flex justify-center items-center p-1 ${bgGreenColor} rounded-xl`}>
                    <HiArrowNarrowLeft/>
                    <div>
                        {-crossWind} kts
                    </div>
                </div>
            );
        } else if (crossWind > 0) {
            crossWindButton = (
                <div className={`flex justify-center items-center p-1 ${bgGreenColor} rounded-xl`}>
                    <HiArrowNarrowRight/>
                    <div>
                        {crossWind} kts
                    </div>
                </div>
            );
        }


        if (headWind <= 0) {
            headWindButton = (
                <div className={`flex justify-center items-center p-1 ${bgRedColor} rounded-xl`}>
                    <HiArrowNarrowUp/>
                    <div>
                        {-headWind} kts
                    </div>
                </div>
            );
        } else if (headWind > 0) {
            headWindButton = (
                <div className={`flex justify-center items-center p-1 ${bgGreenColor} rounded-xl`}>
                    <HiArrowNarrowDown/>
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
    const airportElevation = airportData.elevation;
    const airportTransAltitude = airportData.transitionAltitude;

    const renderedRunways = airportData.runways.map((runways) => (
        <div key={runways.runway_id} className="p-3 flex flex-col">
            <div className="italic font-bold">
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


    const handleClick = () => {
        dispatch(setSelectedAirportICAO(airportData.ICAO));
        navigate(`/airport/detail/${airportData.ICAO}`);
    };

    return (
        <div className="text-sm p-3 md:text-lg font-Rubik">
            <div className="flex flex-col justify-center items-center gap-2">
                <div>
                    {row.raw_text}
                </div>
                <div>
                    {airportElevation ? `Elevation: ${airportElevation} ft` : ""}
                </div>
                <div>
                    {airportTransAltitude ? `Transition Altitude: ${airportTransAltitude} ft` : ""}
                </div>
                <div>
                    <button
                        onClick={handleClick}
                        className="text-white rounded-xl bg-green-600 p-2 hover:bg-amber-400 hover:text-gray-600"
                    >Go
                        to airport
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 justify-center justify-items-center ">
                {renderedRunways}
            </div>
        </div>
    );
}

export default ExpandableContentAirportInfo;
