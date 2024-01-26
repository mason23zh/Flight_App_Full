import React from "react";
import { Popup } from "react-map-gl";

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
    const lon = Number(hoverInfo.coordinates[0]);
    const lat = Number(hoverInfo.coordinates[1]);
    const airportName = hoverInfo.airportName;


    return (
        <Popup
            style={{ zIndex: 100 }}
            closeButton={false}
            anchor="bottom"
            longitude={lon}
            latitude={lat}
        >
            <div>
                {airportName}
            </div>
        </Popup>
    );
};

export default ControllerMarkerPopup;