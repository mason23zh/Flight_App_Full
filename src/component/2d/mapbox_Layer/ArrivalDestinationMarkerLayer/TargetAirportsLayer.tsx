/**
 * Use to render traffic arrival airport and departure airports marker
 * Use to render the path from arrival airport ato departure airport
 * **/
import React, { useMemo, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import Pin from "./Pin";


const TargetAirportsLayer = ({
    departureAirport,
    arrivalAirport
}) => {
    const [popupInfo, setPopupInfo] = useState(null);

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
                <Pin type="DEPARTURE" size={38}/>

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
                <Pin type="ARRIVAL" size={38}/>
            </Marker>
        </>
    ),
    [departureAirport.data[0]?.station.geometry.coordinates[0],
        arrivalAirport.data[0]?.station.geometry.coordinates[0]]);


    return (
        <div>
            {pins}
            {popupInfo && (
                <Popup
                    anchor="bottom-right"
                    longitude={Number(arrivalAirport.data[0].station.geometry.coordinates[0])}
                    latitude={Number(arrivalAirport.data[0].station.geometry.coordinates[1])}
                    onClose={() => setPopupInfo(null)}
                >
                    <div>
                        {arrivalAirport.data[0].station.name}
                    </div>

                </Popup>
            )}
            {/* <Marker */}
            {/*     style={{ zIndex: 10 }} */}
            {/*     longitude={Number(departureAirport.data[0].station.geometry.coordinates[0])} */}
            {/*     latitude={Number(departureAirport.data[0].station.geometry.coordinates[1])} */}
            {/*     scale={0.5} */}
            {/* > */}
            {/*     <Pin type="DEPARTURE" size={38}/> */}

            {/* </Marker> */}

            {/* <Marker */}
            {/*     style={{ zIndex: 10 }} */}
            {/*     longitude={Number(arrivalAirport.data[0].station.geometry.coordinates[0])} */}
            {/*     latitude={Number(arrivalAirport.data[0].station.geometry.coordinates[1])} */}
            {/*     scale={0.5} */}
            {/* > */}
            {/*     <Pin type="ARRIVAL" size={38}/> */}
            {/* </Marker> */}


        </div>
    );
};

export default TargetAirportsLayer;