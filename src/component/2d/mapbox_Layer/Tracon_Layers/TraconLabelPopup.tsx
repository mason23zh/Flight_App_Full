import React from "react";
import { Popup } from "react-map-gl";
import { returnOnlineTime } from "../util/calculateOnlineTime";
import { useTheme } from "../../../../hooks/ThemeContext";
import { MatchedTracon } from "../../../../hooks/useMatchTracon";

interface Props {
    hoverTracon: MatchedTracon;
}

const TraconLabelPopup = ({ hoverTracon }: Props) => {
    const darkMode = useTheme();
    let lon: number;
    let lat: number;
    if (hoverTracon.traconInfo.coordinates.length == 2) {
        lon = Number(hoverTracon.traconInfo.coordinates[0]);
        lat = Number(hoverTracon.traconInfo.coordinates[1]);
    }

    const traconName = hoverTracon.traconInfo.name;
    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-200 text-gray-700";
    const freqThemeColor = darkMode ? "text-green-400" : "text-blue-600";

    const renderControllersData = hoverTracon.controllers.map((c) => {
        const uniqueKey = c.name + c.callsign;
        const {
            hour,
            minute
        } = returnOnlineTime(c.logon_time);

        return (
            <div key={uniqueKey} className="flex items-center text-center gap-2 px-2 py-1 w-fit">
                <div className="">
                    {c.callsign}
                </div>
                <div className="">
                    {c.name}
                </div>
                <div className={`font-bold ${freqThemeColor}`}>
                    {c.frequency}
                </div>
                <div className="">
                    {hour}:{minute}
                </div>
            </div>
        );
    });

    return (
        <Popup
            longitude={lon}
            latitude={lat}
            style={{ zIndex: 100 }}
            closeButton={false}
            anchor="bottom"
        >
            <div className={`w-full p-2 rounded-lg border-0 font-Rubik ${colorTheme}`}>
                <div className="flex text-center gap-3 justify-self-start w-max">
                    <div className="text-lg font-bold">
                        {traconName}
                    </div>
                </div>

                <div className="w-full">
                    {renderControllersData}
                </div>
            </div>
        </Popup>
    );
};

export default TraconLabelPopup;