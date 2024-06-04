import React from "react";
import { Layer } from "react-map-gl";
import AirportLabelLayer from "./AirportLabelLayer";

const LargeAirportLayer = () => {
    return (
        <>
            <Layer
                type="circle"
                source="gns-430-source"
                source-layer="gns_airport"
                id="large-gns-430-airport-layer"
                filter={["==", "type", "large_airport"]}
                paint={{
                    "circle-color": "#00FF00",
                    "circle-radius": 3
                }}
            />
            <AirportLabelLayer
                id={"large-gns-430-airport-label"}
                filter={["==", "type", "large_airport"]}
                minzoom={6}
            />
        </>
    );
};

export default LargeAirportLayer;