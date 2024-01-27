import React from "react";
import { Popup } from "react-map-gl";
import ControllerPopupContent from "./ControllerPopupContent";

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
    let renderServices;
    const lon = Number(hoverInfo.coordinates[0]);
    const lat = Number(hoverInfo.coordinates[1]);
    const airportName = hoverInfo.airportName;


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
        <Popup
            style={{
                zIndex: 100,
                maxWidth: 400,
                padding: 0,
            }}
            closeButton={false}
            anchor="bottom"
            longitude={lon}
            latitude={lat}
        >
            <div className="grid grid-cols-1 justify-center items-center gap-1 p-1">
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