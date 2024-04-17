import { IconLayer } from "@deck.gl/layers";
import { VatsimFlight } from "../../../types";
import aircraftSpriteSheetMapping from "../../../assets/aircraft-sprite-sheet.json";
import aircraftSpriteSheetPNG from "../../../assets/aircraft-sprite-sheet.png";

//!fix: Scale issue, the narrow body aircraft is way too small

const trafficLayerNew = (data: Array<VatsimFlight>, visible: boolean) => {
    console.log(data);

    return new IconLayer({
        id: "aircraft-icon-layer",
        data: data,
        pickable: true,
        visible: visible,  // Ensure the visibility flag is actually used
        opacity: 1,
        getIcon: d => d.flight_plan?.aircraft_short || "B738",
        autoHighlight: true,
        iconAtlas: aircraftSpriteSheetPNG,
        iconMapping: aircraftSpriteSheetMapping,

        sizeScale: 5,
        getPosition: d => [d.longitude || 0, d.latitude || 0, d.groundspeed < 50 ? 0 : d.altitude],
        // getAngle: (d) => [0, -d.heading || 0, 90],
        getAngle: (d) => -d.heading,
        getColor: () => [228, 235, 10],
        getSize: () => 5
    });
};

export default trafficLayerNew;