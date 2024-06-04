import React from "react";
import { Layer } from "react-map-gl";

const SmallAirportLayer = () => {
    return (
        <Layer
            type="circle"
            source="gns-430-source"
            source-layer="gns_airport"
            id="big-gns-430-airport-layer"
            filter={["==", "type", "small_airport"]}
            minzoom={7}
            paint={{
                "circle-color": "#00FF00",
                "circle-radius": 3
            }}
        />
    );
};

export default SmallAirportLayer;