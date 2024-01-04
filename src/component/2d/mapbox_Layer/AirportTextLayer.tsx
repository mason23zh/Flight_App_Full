import React from "react";
import { Layer } from "react-map-gl";

const AirportTextLayer = () => {
    return (
        <Layer
            id="gns-430-airport-labels"
            type="symbol"
            source="gns-430-source"
            source-layer="gns_airport"
            layout={{
                "text-field": ["get", "ICAO"],
                "text-variable-anchor": ["top", "bottom", "left", "right"],
                "text-radial-offset": 0.5,
                "text-justify": "auto",
            }}
            paint={{
                "text-color": "#000000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 0.5,
            }}
        />
    );
};

export default AirportTextLayer;