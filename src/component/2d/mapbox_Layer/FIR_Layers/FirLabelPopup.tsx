import React from "react";
import { Popup } from "react-map-gl";
import GeoJson from "geojson";
import { returnOnlineTime } from "../util/calculateOnlineTime";
import { useTheme } from "../../../../hooks/ThemeContext";
import { MatchedFir } from "../../../../hooks/useMatchedFirs";
import { hover } from "@testing-library/user-event/dist/hover";

interface Props {
    hoverFir: MatchedFir,
}

const FirLabelPopup = ({
    hoverFir,
}: Props) => {
    if (!hoverFir) return null;

    let tempFirName: string;
    const darkMode = useTheme();

    if (hoverFir.firInfo.name && hoverFir.firInfo.suffix) {
        tempFirName = hoverFir.firInfo.name + " " + hoverFir.firInfo.suffix;
    } else {
        tempFirName = hoverFir.firInfo.name;
    }

    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-200 text-gray-700";
    const freqThemeColor = darkMode ? "text-green-400" : "text-blue-600";
    const callsignColor = darkMode ? "text-purple-300" : "text-purple-500";

    // construct the controllers list
    const renderControllersData = hoverFir.controllers.map((c) => {
        const {
            hour,
            minute
        } = returnOnlineTime(c.logon_time);
        const key = `${c.name}-${c.logon_time}`;
        return (
            <div key={key} className="flex items-center text-center gap-2 px-2 py-1 w-fit">
                <div className={c.callsign.includes("FSS") ? callsignColor : ""}>
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
            style={{
                zIndex: 100,
            }}
            maxWidth="500px"
            longitude={Number(hoverFir.firInfo.entries[0].label_lon)}
            latitude={Number(hoverFir.firInfo.entries[0].label_lat)}
            closeButton={false}
            anchor="bottom"
        >

            <div className={`w-full p-2 font-Rubik rounded-xl ${colorTheme}`}>
                <div className="flex text-center gap-3 justify-self-start w-full">
                    <div className="text-[17px] font-bold">
                        {hoverFir.firInfo.icao}
                    </div>
                    <div className="text-[17px]">
                        {tempFirName}
                    </div>
                </div>

                <div className="w-full">
                    {renderControllersData}
                </div>
            </div>
        </Popup>
    );
};

export default FirLabelPopup;