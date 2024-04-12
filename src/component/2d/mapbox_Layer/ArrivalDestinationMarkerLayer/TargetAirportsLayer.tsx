/**
 * Use to render traffic arrival airport and departure airports marker
 * Use to render the path from arrival airport ato departure airport
 * **/
import React, { useMemo, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import Pin from "./Pin";
import useDelayHoverLabel from "../../../../hooks/useDelayHoverLabel";
import { AirportResponse } from "../../../../types";

interface TargetAirportsLayerProps {
    departureAirport: AirportResponse;
    arrivalAirport: AirportResponse;
}


const TargetAirportsLayer = ({
    departureAirport,
    arrivalAirport
}: TargetAirportsLayerProps) => {
    const [popupInfo, setPopupInfo] = useState(null);
    const [hoverInfo, handleMouse] = useDelayHoverLabel();
    const hoverAirportInfo = hoverInfo as AirportResponse || null;

    console.log("Departure airport:", departureAirport);
    console.log("Arrival airport:", arrivalAirport);
    if (!departureAirport.data[0] || !arrivalAirport.data[0]) {
        return (<></>);
    }

    const pins = useMemo(() => (
        <>
            <Marker
                style={{ zIndex: 10 }}
                longitude={Number(departureAirport.data[0].station.geometry.coordinates[0])}
                latitude={Number(departureAirport.data[0].station.geometry.coordinates[1])}
                scale={0.5}
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo(arrivalAirport);
                }}
            >
                <div
                    onMouseEnter={() => handleMouse(departureAirport, true, 150, 10)}
                    onMouseLeave={() => handleMouse(null, false, 150, 10)}
                >
                    <Pin type="DEPARTURE" size={38}/>
                </div>

            </Marker>

            <Marker
                style={{ zIndex: 10 }}
                longitude={Number(arrivalAirport.data[0].station.geometry.coordinates[0])}
                latitude={Number(arrivalAirport.data[0].station.geometry.coordinates[1])}
                scale={0.5}
                onClick={e => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo(departureAirport);
                }}
            >
                <div
                    onMouseEnter={() => handleMouse(arrivalAirport, true, 150, 10)}
                    onMouseLeave={() => handleMouse(null, false, 150, 10)}
                >
                    <Pin type="ARRIVAL" size={38}/>
                </div>
            </Marker>
        </>
    ),
    [departureAirport.data[0]?.station.geometry.coordinates[0],
        arrivalAirport.data[0]?.station.geometry.coordinates[0]]);


    if (hoverInfo) {
        console.log("Hover info:", hoverInfo);
    }

    return (
        <div>
            {pins}
            {hoverInfo && (
                <Popup
                    anchor="bottom-right"
                    longitude={Number(hoverAirportInfo.data[0].station.geometry.coordinates[0])}
                    latitude={Number(hoverAirportInfo.data[0].station.geometry.coordinates[1])}
                >
                    <div>
                        {hoverAirportInfo.data[0].station.name}
                    </div>

                </Popup>
            )}
        </div>
    );
};

export default TargetAirportsLayer;