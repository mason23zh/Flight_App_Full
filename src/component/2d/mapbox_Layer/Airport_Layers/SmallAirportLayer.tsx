import React from "react";
import { Layer } from "react-map-gl";
import AirportLabelLayer from "./AirportLabelLayer";

const SmallAirportLayer = () => {
    return (
        <>
            <Layer
                type="circle"
                source="gns-430-source"
                source-layer="gns_airport"
                id="small-gns-430-airport-layer"
                filter={["==", "type", "small_airport"]}
                minzoom={7}
                paint={{
                    "circle-color": "#00FF00",
                    "circle-radius": 3
                }}
            />
            <AirportLabelLayer
                id="small-gns-430-airport-label"
                filter={["==", "type", "small_airport"]}
                minzoom={9}
            />
        </>
    );
};

export default SmallAirportLayer;