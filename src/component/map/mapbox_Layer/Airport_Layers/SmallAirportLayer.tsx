import React from "react";
import { Layer } from "react-map-gl";
import AirportLabelLayer from "./AirportLabelLayer";

const SmallAirportLayer = ({ displayLabel }) => {
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
                    "circle-color": "#3f9cd1",
                    "circle-radius": 3
                }}
            />
            {displayLabel &&
                <AirportLabelLayer
                    id="small-gns-430-airport-label"
                    allowTextOverlap={false}
                    minzoom={7}
                    filter={["==", "type", "small_airport"]}
                    textFiled={[
                        "step",
                        ["zoom"],
                        ["get", "ICAO"],
                        8,
                        ["concat", ["get", "ICAO"], " \n ", ["get", "name"]]
                    ]}
                />
            }
        </>
    );
};

export default SmallAirportLayer;