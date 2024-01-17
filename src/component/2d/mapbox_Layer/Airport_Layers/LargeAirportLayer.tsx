import React from "react";
import { Layer } from "react-map-gl";

const LargeAirportLayer = () => {
    return (
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
    );
};

export default LargeAirportLayer;