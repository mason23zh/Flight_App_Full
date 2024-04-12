import React from "react";
import { Popup } from "react-map-gl";
import { AirportResponse } from "../../../../types";

interface TargetAirportsHoverPopupProps {
    airportInfo: AirportResponse;
}

const TargetAirportsHoverPopup = ({ airportInfo }: TargetAirportsHoverPopupProps) => {
    return (
        <Popup
            anchor="bottom-right"
            longitude={Number(airportInfo.data[0].station.geometry.coordinates[0])}
            latitude={Number(airportInfo.data[0].station.geometry.coordinates[1])}
        >
            <div>
                {airportInfo.data[0].station.name}
            </div>
        </Popup>
    );
};

export default TargetAirportsHoverPopup;