import { VatsimFlight } from "../types";
import aircraftSpriteSheetMapping from "../assets/mapbox/aircraft_sprite_mapping.json";
import aircraftSpriteSheetPNG from "../assets/mapbox/aircraft_sprite_mapping-0.png";
import { getAircraftSizeCategory } from "../util/getAircraftCategory";
import { IconLayer } from "@deck.gl/layers/typed";
import { PickingInfo } from "@deck.gl/core/typed";

const useTrafficLayer2D = (
    data: Array<VatsimFlight>,
    visible: boolean,
    onHover: (info: PickingInfo) => void
) => {
    if (!data || data.length === 0) return null;

    const updateTriggers = {
        getPosition: data.map(d => `${d.longitude},${d.latitude}`)
            .join("-"),  // Trigger update if positions change
        getAngle: data.map(d => d.heading)
            .join("-"),  // Trigger update if headings change
        getIcon: data.map(d => d.flight_plan?.aircraft_short || "CL60")
            .join("-"),  // Trigger update if icons change
        getSize: data.map(d => getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738"))
            .join("-"),  // Trigger update if sizes change
    };


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
        onHover: (info: PickingInfo) => {
            if (info.object) {
                onHover(info);
            } else {
                onHover(null);
            }
        },
        getPosition: (d: VatsimFlight) => [d.longitude || 0, d.latitude || 0, 0], //traffic always at 0 feet in 2d view
        getAngle: (d: VatsimFlight) => -d.heading,
        getColor: () => [228, 235, 10],
        getSize: (d: VatsimFlight) => {
            return getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738");
        },
        updateTriggers: updateTriggers
    });
};

export default useTrafficLayer2D;