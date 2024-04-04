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

    const {
        hour,
        minute
    } = returnOnlineTime(hoverFir.features[0].properties.logon_time);

    const firName = hoverFir.features[0].properties.firInfo.name;
    if (firName.includes("Central") || firName.includes("Radar") || firName.includes("ACC")) {
        tempFirName = firName;
    } else {
        tempFirName = firName + " Center";
    }

    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-300 text-gray-600";
    const freqThemeColor = darkMode ? "text-green-400" : "text-blue-600";

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

            <div className={`w-full p-2 font-Rubik ${colorTheme}`}>
                <div className="flex text-center gap-3 justify-self-start w-full">
                    <div className="text-[17px] font-bold">
                        {hoverFir.features[0].properties.id}
                    </div>
                    <div className="text-[17px]">
                        {tempFirName}
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex items-center text-center gap-2 px-2 py-1 w-fit">
                        <div className="">
                            {hoverFir.features[0].properties.callsign}
                        </div>
                        <div className="">
                            {hoverFir.features[0].properties.name}
                        </div>
                        <div className={`font-bold ${freqThemeColor}`}>
                            {hoverFir.features[0].properties.frequency}
                        </div>
                        <div className="">
                            {hour}:{minute}
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default FirLabelPopup;