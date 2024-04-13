import React from "react";
import { AirportResponse } from "../../../../types";
import { Source, Layer } from "react-map-gl";
import { connectionPathStyle } from "./airportConnectionPathStyle";
import GeoJson from "geojson";
import { calculateGreatCirclePoints } from "../util/calculateGreatCirclePoints";

interface AirportConnectionPathLayerProps {
    departureAirport: AirportResponse;
    arrivalAirport: AirportResponse;
}

const AirportConnectionPathLayer = ({
    departureAirport,
    arrivalAirport
}: AirportConnectionPathLayerProps) => {
    const greatPathCoords = calculateGreatCirclePoints(
        departureAirport.data[0].station.geometry.coordinates,
        arrivalAirport.data[0].station.geometry.coordinates,
    );

    const lineData = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: greatPathCoords
        }
    } as GeoJson.Feature;


    return (
        <Source type="geojson" id="airport-connection-path" data={lineData}>
            <Layer {...connectionPathStyle}/>
        </Source>
    );
};

export default AirportConnectionPathLayer;