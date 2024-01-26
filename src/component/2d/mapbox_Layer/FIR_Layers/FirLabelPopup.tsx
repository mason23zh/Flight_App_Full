import React from "react";
import { Popup } from "react-map-gl";
import GeoJson from "geojson";
import { VatsimFirs } from "../../../../types";
import { returnOnlineTime } from "../util/calculateOnlineTime";

interface Props {
    hoverFir: GeoJson.FeatureCollection,
    firData: VatsimFirs
}

const FirLabelPopup = ({
    hoverFir,
    firData
}: Props) => {
    const {
        hour,
        minute
    } = returnOnlineTime(hoverFir.features[0].properties.logon_time);

    console.log("Hover Fir label geoJsonFeature", hoverFir);

    const firName = hoverFir.features[0].properties.firInfo.name;
    let tempFirName;
    if (firName.includes("Central") || firName.includes("Radar") || firName.includes("ACC")) {
        tempFirName = firName;
    } else {
        tempFirName = firName + " Center";
    }

    console.log("fir popup name:", firName);

    return (
        <Popup
            style={{ zIndex: 100 }}
            longitude={Number(hoverFir.features[0].properties.label_lon)}
            latitude={Number(hoverFir.features[0].properties.label_lat)}
            closeButton={false}
            anchor="bottom"
        >

            <div className="w-full">
                <div className="flex text-center gap-3 justify-self-start w-full">
                    <div className="text-lg font-bold text-gray-600">
                        {hoverFir.features[0].properties.id}
                    </div>
                    <div className="text-lg text-black">
                        {/* {firData[hoverFir.features[0].properties.id].name} */}
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
                        <div className="text-blue-500 font-bold">
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