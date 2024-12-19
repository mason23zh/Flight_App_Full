import React from "react";
import { Layer } from "react-map-gl";
import AirportLabelLayer from "./AirportLabelLayer";

const MediumAirportLayer = ({ displayLabel }) => {
    return (
        <>
            <Layer
                type="circle"
                source="gns-430-source"
                source-layer="gns_airport"
                id="medium-gns-430-airport-layer"
                filter={["==", "type", "medium_airport"]}
                minzoom={5}
                paint={{
                    "circle-color": "#3f9cd1",
                    "circle-radius": 3
                }}
            />
            {displayLabel &&
                <AirportLabelLayer
                    id="medium-gns-430-airport-label"
                    allowTextOverlap={false}
                    filter={["==", "type", "medium_airport"]}
                    textFiled={[
                        "step",
                        ["zoom"],
                        ["get", "ICAO"],
                        7,
                        ["concat", ["get", "ICAO"], " \n ", ["get", "name"]]
                    ]}
                    minzoom={5}
                />
            }
        </>
    );
};

export default MediumAirportLayer;