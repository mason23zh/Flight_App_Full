import React from "react";
import { Layer } from "react-map-gl";

const MediumAirportLayer = () => {
    return (
        <Layer
            type="circle"
            source="gns-430-source"
            source-layer="gns_airport"
            id="medium-gns-430-airport-layer"
            filter={["==", "type", "medium_airport"]}
            minzoom={5.5}
            paint={{
                "circle-color": "#00FF00",
                "circle-radius": 3
            }}
        />
    );
};

export default MediumAirportLayer;