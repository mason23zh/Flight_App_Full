import React from "react";
import { Popup } from "react-map-gl";
import ControllerPopupContent from "./ControllerPopupContent";
import { markerOffsetObject } from "../util/helpers";
import { useTheme } from "../../../../hooks/ThemeContext";

interface Service {
    airport: { name: string, icao: string },
    callsign: string,
    cid: string,
    coordinates: string[],
    facility: number,
    frequency: string,
    last_updated: string,
    logon_time: string,
    name: string,
    rating: number,
    server: string,
    serviceType: string,
    text_atis: string[],
    visual_range: number,
    atis_code?: string,
}

interface AirportService {
    airportName: string,
    icao: string,
    coordinates: string[],
    services: Array<Service>
}

interface Props {
    hoverInfo: AirportService;
}


const ControllerMarkerPopup = ({ hoverInfo }: Props) => {
    let renderServices: JSX.Element[];
    const lon = Number(hoverInfo.coordinates[0]);
    const lat = Number(hoverInfo.coordinates[1]);
    const airportName = hoverInfo.airportName;
    const darkMode = useTheme();

    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-300 text-gray-600";


    if (hoverInfo.services && hoverInfo.services.length > 0) {
        renderServices = hoverInfo.services.map((serviceInfo) => {
            if (serviceInfo.facility !== 5) {
                return (
                    <div key={serviceInfo.callsign}>
                        <ControllerPopupContent
                            serviceData={serviceInfo}
                            serviceType={serviceInfo.serviceType}/>
                    </div>
                );
            }
        });
    }

    return (
    //@ts-expect-error to avoid "Property 'offset' does not exist" in Popup
        <Popup
            style={{
                zIndex: 100,
            }}
            closeButton={false}
            longitude={lon}
            latitude={lat}
            maxWidth="500"
            offset={markerOffsetObject}
        >
            <div className={`grid grid-cols-1 justify-center items-center
            gap-1 p-2 w-full rounded-lg font-Rubik ${colorTheme}`}
            >
                <div className="justify-self-start font-extrabold">
                    {airportName}
                </div>
                <div className="justify-self-start font-medium italic">
                    {hoverInfo.icao}
                </div>
                {renderServices}
            </div>
        </Popup>
    );
};

export default ControllerMarkerPopup;