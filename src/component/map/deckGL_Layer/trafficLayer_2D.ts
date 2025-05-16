/*
 * Using IconLayer to render all vatsim traffic with png format
 */
// import React from "react";
import { IconLayer } from "@deck.gl/layers";
import { VatsimFlight } from "../../../types";
import { getAircraftSizeCategory } from "../../../util/getAircraftCategory";
import aircraftSpriteSheetMapping from "../../../assets/mapbox/mapbox-icon-mapping-v1.json";
import aircraftSpriteSheetPNG from "../../../assets/mapbox/aircraft_sprite_mapping-0.png";

const trafficLayer_2D = (data: Array<VatsimFlight>, visible: boolean) => {
    if (!data) return null;
    return new IconLayer({
        id: "traffic-layer-2d",
        data: data,
        pickable: true,
        visible: visible,
        opacity: 1,
        getIcon: (d: VatsimFlight) => {
            const icon = d.flight_plan?.aircraft_short || "CL60";
            return aircraftSpriteSheetMapping[icon] ? icon : "CL60";
        },
        autoHighlight: true,
        iconAtlas: aircraftSpriteSheetPNG,
        iconMapping: aircraftSpriteSheetMapping,
        sizeScale: 5,
        getPosition: (d: VatsimFlight) => [d.longitude || 0, d.latitude || 0, 0], //traffic always at 0 feet in 2d view
        getAngle: (d: VatsimFlight) => -d.heading,
        getColor: () => [228, 235, 10],
        getSize: (d: VatsimFlight) => {
            return getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738");
        },
    });
};

export default trafficLayer_2D;
