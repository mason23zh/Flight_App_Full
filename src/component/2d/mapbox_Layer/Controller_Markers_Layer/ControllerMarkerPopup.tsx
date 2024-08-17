import React, { useEffect, useRef } from "react";
import { Popup } from "react-map-gl";
import ControllerPopupContent from "./ControllerPopupContent";
import { markerOffsetObject } from "../util/helpers";
import { useTheme } from "../../../../hooks/ThemeContext";
import useIsTouchScreen from "../../../../hooks/useIsTouchScreen";
import mapboxgl from "mapbox-gl";

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
    const isTouchScreen = useIsTouchScreen();
    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-200 text-gray-700";
    const popupRef = useRef<mapboxgl.Popup | null>(null);


    if (hoverInfo.services && hoverInfo.services.length > 0) {
        renderServices = hoverInfo.services
            .filter(serviceInfo => serviceInfo.facility !== 5)
            .map((serviceInfo) => {
                return (
                    <div key={serviceInfo.callsign}>
                        <ControllerPopupContent
                            serviceData={serviceInfo}
                            serviceType={serviceInfo.serviceType}/>
                    </div>
                );
            });
    }

    useEffect(() => {
        if (popupRef.current) {
            if (!isTouchScreen) {
                // @ts-ignore
                popupRef.current.setOffset(markerOffsetObject);

            } else {
                popupRef.current.setOffset([0, -40]);
            }
        }
    }, [popupRef.current]);

    return (
        <Popup
            ref={popupRef}
            style={{
                zIndex: 100,
            }}
            closeButton={false}
            longitude={lon}
            latitude={lat}
            maxWidth={isTouchScreen ? "380px" : "500px"}
            anchor={isTouchScreen ? "bottom" : undefined}
            // offset={markerOffsetObject}
        >
            <div className={`grid grid-cols-1 justify-center items-center
            gap-1 p-1 sm:p-2 w-full rounded-lg font-Rubik ${colorTheme}`}
            >
                <div className="justify-self-start italic
                font-bold text-sm sm:text-lg">
                    {hoverInfo.icao}
                </div>
                <div className="justify-self-start font-extrabold">
                    {airportName}
                </div>
                {renderServices}
            </div>
        </Popup>
    );
};

export default ControllerMarkerPopup;