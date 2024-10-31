// Create MultiPolygon Circle with turf lib
// This will handle the case if no tracon GeoJson been found, and we would use controller visual range to
// generate a GeoJson multipolygon circle
import * as turf from "@turf/turf";
import { Feature, MultiPolygon } from "geojson";

export const createMultiPolygonCircle = (center, radius, options, controllerInfo): Feature<MultiPolygon> => {
    if (isNaN(center[0]) || isNaN(center[1])) return;


    const circle = turf.circle(center, radius, options);

    return {
        type: "Feature",
        properties: {
            id: controllerInfo.callsign,
            prefix: [controllerInfo.callsign]
        },
        geometry: {
            type: "MultiPolygon",
            coordinates: [circle.geometry.coordinates]
        }
    };
};