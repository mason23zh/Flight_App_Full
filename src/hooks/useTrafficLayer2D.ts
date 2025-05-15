import { VatsimFlight } from "../types";
import aircraftSpriteSheetPNG from "../assets/mapbox/mapbox-icon-mapping-v1.png";
import aircraftSpriteSheetMapping from "../assets/mapbox/mapbox-icon-mapping-v1.json";
import { getAircraftSizeCategory } from "../util/getAircraftCategory";
import { IconLayer } from "@deck.gl/layers/typed";
import { useMemo } from "react";
const useTrafficLayer2D = (data: Array<VatsimFlight>, visible: boolean) => {
    return useMemo(() => {
        if (!data || data.length === 0) return null;

        const updateTriggers = {
            getPosition: data.map((d) => `${d.longitude},${d.latitude}`).join("-"), // Trigger update if positions change
            getAngle: data.map((d) => d.heading).join("-"), // Trigger update if headings change
            getIcon: data.map((d) => d.flight_plan?.aircraft_short || "CL60").join("-"), // Trigger update if icons change
            getSize: data.map((d) => getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738")).join("-"), // Trigger update if sizes change
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
            // highlightColor: [255, 128, 0, 128],
            iconAtlas: aircraftSpriteSheetPNG,
            iconMapping: aircraftSpriteSheetMapping,
            // sizeScale: 5,
            // sizeScale: 2.8,
            sizeScale: 2.3,
            getPosition: (d: VatsimFlight) => [d.longitude || 0, d.latitude || 0, 0], //traffic always at 0 feet in 2d view
            getAngle: (d: VatsimFlight) => -d.heading,
            getColor: () => [228, 235, 10],
            // getColor: [195, 201, 6],
            // getSize: 5,
            getSize: (d: VatsimFlight) => {
                return getAircraftSizeCategory(d.flight_plan?.aircraft_short || "B738");
            },
            updateTriggers: updateTriggers,
        });
    }, [data, visible]);
};

export default useTrafficLayer2D;
