import React from "react";
import { Popup } from "react-map-gl";
import GeoJson from "geojson";
import { VatsimFirs } from "../../../../types";
import moment from "moment/moment";

interface Props {
    hoverFir: GeoJson.FeatureCollection,
    firData: VatsimFirs
}

const FirLabelPopup = ({
    hoverFir,
    firData
}: Props) => {
    const returnOnlineTime = (logonTime: string) => {
        const logonTimeStamp = moment(logonTime);
        // duration in seconds and remove day
        let durationAsSeconds = moment.duration(moment(new Date())
            .diff(logonTimeStamp))
            .asSeconds() % 86400;
        const durationHour = durationAsSeconds / 3600;
        durationAsSeconds %= 3600;
        const durationMinute = durationAsSeconds / 60;
        // append 0 if minutes return as a single digit
        return `${Math.round(durationHour)}:${("0" + Math.round(durationMinute)).slice(-2)}`;
    };

    return (
        <Popup
            longitude={Number(hoverFir.features[0].properties.label_lon)}
            latitude={Number(hoverFir.features[0].properties.label_lat)}
            closeButton={false}
            anchor="bottom"
        >

            <div className="w-full">
                <div className="flex text-center gap-3 justify-self-start w-max">
                    <div className="text-lg font-bold text-gray-600">
                        {hoverFir.features[0].properties.id}
                    </div>
                    <div className="text-lg text-black">
                        {firData[hoverFir.features[0].properties.id].name}
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
                            {returnOnlineTime(hoverFir.features[0].properties.logon_time)}
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default FirLabelPopup;