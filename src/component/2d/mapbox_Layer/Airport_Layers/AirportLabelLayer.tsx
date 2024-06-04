import React from "react";
import { Layer } from "react-map-gl";

interface Props {
    id: string,
    filter: string[],
    minzoom: number,
}

const AirportLabelLayer = ({
    id,
    filter,
    minzoom
}: Props) => {
    return (
        <Layer
            type="symbol"
            source="gns-430-source"
            source-layer="gns_airport"
            id={id}
            filter={filter}
            minzoom={minzoom}
            layout={{
                "text-field": ["concat", ["get", "ICAO"], " - ", ["get", "name"]],
                "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
                "text-size": 12,
                "text-offset": [0, 1.5],
                "text-anchor": "top",
            }}
            paint={{
                "text-color": "#000000",
                "text-halo-color": "#FFFFFF",
                "text-halo-width": 1,
            }}
        />
    );
};

export default AirportLabelLayer;