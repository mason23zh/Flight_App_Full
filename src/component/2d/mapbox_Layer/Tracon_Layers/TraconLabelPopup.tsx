import React from "react";
import GeoJson from "geojson";
import { Popup } from "react-map-gl";
import { returnOnlineTime } from "../util/calculateOnlineTime";

interface Props {
    hoverTracon: GeoJson.FeatureCollection;
}

const TraconLabelPopup = ({ hoverTracon }: Props) => {
    let lon: number;
    let lat: number;
    if ("coordinates" in hoverTracon.features[0].geometry) {
        lon = Number(hoverTracon.features[0].geometry.coordinates[0][0][0][0]);
        lat = Number(hoverTracon.features[0].geometry.coordinates[0][0][0][1]);
    }
    const controllerName = hoverTracon.features[0].properties.controllerInfo.name;
    const logon_time = hoverTracon.features[0].properties.controllerInfo.logon_time;
    const freq = hoverTracon.features[0].properties.controllerInfo.frequency;
    const controllerCallsign = hoverTracon.features[0].properties.controllerInfo.callsign;
    const traconName = hoverTracon.features[0].properties.name;

    const {
        hour,
        minute
    } = returnOnlineTime(logon_time);

    return (
        <Popup
            longitude={lon}
            latitude={lat}
            style={{ zIndex: 100 }}
            closeButton={false}
            anchor="bottom"
        >
            <div className="w-full p-2">
                <div className="flex text-center gap-3 justify-self-start w-max">
                    <div className="text-lg font-bold text-gray-600">
                        {traconName}
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex items-center text-center gap-2 px-2 py-1 w-fit">
                        <div className="">
                            {controllerCallsign}
                        </div>
                        <div className="">
                            {controllerName}
                        </div>
                        <div className="text-blue-500 font-bold">
                            {freq}
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

export default TraconLabelPopup;