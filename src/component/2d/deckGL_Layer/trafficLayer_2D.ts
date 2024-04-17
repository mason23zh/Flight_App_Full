/*
* Using IconLayer to render all vatsim traffic with png format
*/

import { IconLayer } from "@deck.gl/layers";
import { VatsimFlight } from "../../../types";
import { getAircraftSizeCategory } from "../../../util/getAircraftCategory";
import aircraftSpriteSheetMapping from "../../../assets/aircraft-sprite-sheet.json";
import aircraftSpriteSheetPNG from "../../../assets/aircraft-sprite-sheet.png";

const trafficLayer_2D = (data: Array<VatsimFlight>, visible: boolean) => {

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
        getAngle: (d) => -d.heading,
        getColor: () => [228, 235, 10],
        getSize: (d) => {
            return getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738");
        }
    });
};

export default trafficLayer_2D;