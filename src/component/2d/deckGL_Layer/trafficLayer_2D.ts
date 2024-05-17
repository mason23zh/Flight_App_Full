/*
* Using IconLayer to render all vatsim traffic with png format
*/
// import React from "react";
import { IconLayer } from "@deck.gl/layers";
import { VatsimFlight } from "../../../types";
import { getAircraftSizeCategory } from "../../../util/getAircraftCategory";
import aircraftSpriteSheetMapping from "../../../assets/mapbox/aircraft-sprite-sheet.json";
import aircraftSpriteSheetPNG from "../../../assets/mapbox/aircraft-sprite-sheet.png";

const trafficLayer_2D = (data: Array<VatsimFlight>, visible: boolean) => {
    if (!visible) return null;

    return new IconLayer({
        id: "aircraft-icon-layer",
        data: data,
        pickable: true,
        visible: visible,  // Ensure the visibility flag is actually used
        opacity: 1,
        getIcon: (d: VatsimFlight) => d.flight_plan?.aircraft_short || "B738",
        autoHighlight: true,
        iconAtlas: aircraftSpriteSheetPNG,
        iconMapping: aircraftSpriteSheetMapping,
        sizeScale: 5,
        getPosition: (d: VatsimFlight) => [d.longitude || 0, d.latitude || 0, 0], //traffic always at 0 feet in 2d view
        getAngle: (d: VatsimFlight) => -d.heading,
        getColor: () => [228, 235, 10],
        getSize: (d: VatsimFlight) => {
            return getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738");
        }
    });
};

export default trafficLayer_2D;