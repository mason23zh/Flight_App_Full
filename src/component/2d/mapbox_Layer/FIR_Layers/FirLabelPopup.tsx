import React from "react";
import { Popup } from "react-map-gl";
import GeoJson from "geojson";
import { VatsimFirs } from "../../../../types";
import { returnOnlineTime } from "../util/calculateOnlineTime";
import { useTheme } from "../../../../hooks/ThemeContext";

interface Props {
    hoverFir: GeoJson.FeatureCollection,
    firData: VatsimFirs
}

const FirLabelPopup = ({
    hoverFir,
}: Props) => {
    let tempFirName: string;
    const darkMode = useTheme();


    const firName = hoverFir.features[0].properties.firInfo.name;
    // Normalize the En route controller to "Center"
    if (firName.includes("Central") || firName.includes("Radar") || firName.includes("ACC")) {
        tempFirName = firName;
    } else {
        tempFirName = firName + " Center";
    }

    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-200 text-gray-700";
    const freqThemeColor = darkMode ? "text-green-400" : "text-blue-600";
    const callsignColor = darkMode ? "text-purple-300" : "text-purple-500";

    // construct the controllers list
    const renderControllersData = hoverFir.features[0].properties.controllers.map((c) => {
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
            longitude={Number(hoverFir.features[0].properties.label_lon)}
            latitude={Number(hoverFir.features[0].properties.label_lat)}
            closeButton={false}
            anchor="bottom"
        >

            <div className={`w-full p-2 font-Rubik rounded-xl ${colorTheme}`}>
                <div className="flex text-center gap-3 justify-self-start w-full">
                    <div className="text-[17px] font-bold">
                        {hoverFir.features[0].properties.id}
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