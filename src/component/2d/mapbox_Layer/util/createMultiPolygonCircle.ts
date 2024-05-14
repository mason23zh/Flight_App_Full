// Create MultiPolygon Circle with turf lib
// This will handle the case if no tracon GeoJson been found, and we would use controller visual range to
// generate a GeoJson multipolygon circle
import * as turf from "@turf/turf";

export const createMultiPolygonCircle = (center, radius, options, controllerInfo) => {
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