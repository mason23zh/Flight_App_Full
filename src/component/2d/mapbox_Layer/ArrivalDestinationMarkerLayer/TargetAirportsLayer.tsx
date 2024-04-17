/**
 * Use to render traffic arrival airport and departure airports marker
 * Use to render the path from arrival airport ato departure airport
 * **/
import React, { useMemo } from "react";
import { Marker } from "react-map-gl";
import Pin from "./Pin";
import useDelayHoverLabel from "../../../../hooks/useDelayHoverLabel";
import { AirportResponse } from "../../../../types";
import TargetAirportsHoverPopup from "./TargetAirportsHoverPopup";
import AirportConnectionPathLayer from "./AirportConnectionPathLayer";

interface TargetAirportsLayerProps {
    departureAirport: AirportResponse;
    arrivalAirport: AirportResponse;
}

interface AirportResponseWithDepartureOriginType {
    type: "DEPARTURE" | "ARRIVAL";
    airportInfo: AirportResponse;
}


const TargetAirportsLayer = ({
    departureAirport,
    arrivalAirport
}: TargetAirportsLayerProps) => {
    // ReactGL marker can not be hovered, hence using custom hook here to handle hover
    const [hoverInfo, handleMouse] = useDelayHoverLabel();
    const hoverAirportInfo = hoverInfo as AirportResponseWithDepartureOriginType || null; //cast

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
            >
                <div
                    onMouseEnter={() => handleMouse({
                        type: "DEPARTURE",
                        airportInfo: departureAirport
                    }, true, 150, 10)}
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
            >
                <div
                    onMouseEnter={() => handleMouse({
                        type: "ARRIVAL",
                        airportInfo: arrivalAirport
                    }, true, 150, 10)}
                    onMouseLeave={() => handleMouse(null, false, 150, 10)}
                >
                    <Pin type="ARRIVAL" size={38}/>
                </div>
            </Marker>

        </>
    ),
    [departureAirport.data[0]?.station.geometry.coordinates[0],
        arrivalAirport.data[0]?.station.geometry.coordinates[0]]);

    return (
        <div>
            {pins}
            <AirportConnectionPathLayer
                departureAirport={departureAirport}
                arrivalAirport={arrivalAirport}
            />

            {hoverInfo && <TargetAirportsHoverPopup
                type={hoverAirportInfo.type}
                airportInfo={hoverAirportInfo.airportInfo}
            />}
        </div>
    );
};

export default TargetAirportsLayer;