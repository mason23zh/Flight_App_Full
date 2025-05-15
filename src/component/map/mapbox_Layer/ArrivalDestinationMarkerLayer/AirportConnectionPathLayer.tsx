import { AirportResponse } from "../../../../types";
import { Source, Layer } from "react-map-gl";
import { connectionPathStyle } from "./airportConnectionPathStyle";
import { drawGreatCirclePointsFeature } from "../util/drawGreatCirclePointsFeature";

interface AirportConnectionPathLayerProps {
    departureAirport: AirportResponse;
    arrivalAirport: AirportResponse;
}

const AirportConnectionPathLayer = ({
    departureAirport,
    arrivalAirport
}: AirportConnectionPathLayerProps) => {
    if (!departureAirport.data[0] || !arrivalAirport.data[0]) {
        return;
    }
    const greatCircleFeature = drawGreatCirclePointsFeature(
        departureAirport.data[0].station.geometry.coordinates,
        arrivalAirport.data[0].station.geometry.coordinates,
    );

    return (
        <Source type="geojson" id="airport-connection-path" data={greatCircleFeature}>
            <Layer {...connectionPathStyle} />
        </Source>
    );
};

export default AirportConnectionPathLayer;