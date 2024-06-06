import React from "react";
import { Layer } from "react-map-gl";
import AirportLabelLayer from "./AirportLabelLayer";

const LargeAirportLayer = ({ displayLabel }) => {
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
            {displayLabel &&
                <AirportLabelLayer
                    id={"large-gns-430-airport-label"}
                    allowTextOverlap={false}
                    minzoom={3}
                    filter={["==", "type", "large_airport"]}
                    textFiled={[
                        "step",
                        ["zoom"],
                        ["get", "ICAO"],
                        6,
                        ["concat", ["get", "ICAO"], " \n ", ["get", "name"]]
                    ]}
                />
            }
        </>
    );
};

export default LargeAirportLayer;