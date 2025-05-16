import React from "react";
import { Popup } from "react-map-gl";
import { AirportResponse } from "../../../../types";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { useTheme } from "../../../../hooks/ThemeContext";

interface TargetAirportsHoverPopupProps {
    type: "DEPARTURE" | "ARRIVAL";
    airportInfo: AirportResponse;
}

const TargetAirportsHoverPopup = ({ type, airportInfo }: TargetAirportsHoverPopupProps) => {
    let renderedContent;
    const darkMode = useTheme();

    const colorTheme = darkMode ? "bg-gray-500 text-gray-100" : "bg-gray-200 text-gray-800";

    if (type === "DEPARTURE") {
        renderedContent = (
            <div className={`flex flex-col py-1 px-2 rounded-lg ${colorTheme}`}>
                <div className="flex items-center gap-1">
                    <div>
                        <FaPlaneDeparture
                            className={darkMode ? "text-red-400" : "text-departure-red"}
                        />
                    </div>
                    <div
                        className={
                            darkMode ? "text-red-400 font-bold" : "text-departure-red font-bold"
                        }
                    >
                        DEPARTURE
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div>{airportInfo.data[0].station.name}</div>
                    <div>({airportInfo.data[0].ICAO})</div>
                </div>
            </div>
        );
    } else if (type === "ARRIVAL") {
        renderedContent = (
            <div className={`flex flex-col py-1 px-2 font-Rubik rounded-lg ${colorTheme}`}>
                <div className="flex items-center gap-1">
                    <div>
                        <FaPlaneArrival
                            className={darkMode ? "text-green-500" : "text-arrival-green"}
                        />
                    </div>
                    <div className="text-arrival-green">ARRIVAL</div>
                </div>
                <div className="flex items-center gap-1">
                    <div>{airportInfo.data[0].station.name}</div>
                    <div>({airportInfo.data[0].ICAO})</div>
                </div>
            </div>
        );
    }

    return (
        <Popup
            style={{
                zIndex: 200,
                width: "fit-content",
            }}
            maxWidth="500"
            closeButton={false}
            anchor="top-left"
            offset={15}
            longitude={Number(airportInfo.data[0].station.geometry.coordinates[0])}
            latitude={Number(airportInfo.data[0].station.geometry.coordinates[1])}
        >
            <div>{renderedContent}</div>
        </Popup>
    );
};

export default TargetAirportsHoverPopup;
