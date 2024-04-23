import GeoJson from "geojson";
import { AirportResponse, AirportService } from "../../../../types";

// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isFeatureCollection(
    feature: GeoJson.FeatureCollection | AirportService
): feature is GeoJson.FeatureCollection {
    return "type" in feature && feature["type"] === "FeatureCollection";
}

export function isAirportService(
    feature: GeoJson.FeatureCollection | AirportService | AirportResponse
): feature is AirportService {
    return "services" in feature;
}


// The markerOffsetObject is used to offset the Popup,
// without this the Popup will be positioned at the center.
// This would result Popup overlay with the mouse cursor,
// hence causing the flickering issues.
// Should 'anchor' property been set, the dynamic positioning will be turned off,
// and this will result Popup displayed out of the screen.
// 'anchor' is reversed in the Popup, pay extra attention before changing
// the offset value.
const offsetTop = 10;
const offsetBottom = -40;
const offsetLeft = 25;
export const markerOffsetObject = {
    "top": [0, offsetTop],
    "top-left": [offsetLeft, offsetTop],
    "top-right": [-offsetLeft, offsetTop],
    "bottom": [0, offsetBottom],
    "bottom-left": [offsetLeft, offsetBottom],
    "bottom-right": [-offsetLeft, offsetBottom],
    "left": [offsetLeft, offsetBottom],
    "right": [-offsetLeft, offsetBottom],
};


/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
// export function isFetchBaseQueryError(
//     error: unknown,
// ): error is FetchBaseQueryError {
//     return typeof error === "object" && error != null && "status" in error;
// }

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
// export function isErrorWithMessage(
//     error: unknown,
// ): error is { message: string } {
//     return (
//         typeof error === "object" &&
//             error != null &&
//             "message" in error &&
//             typeof (error as any).message === "string"
//     );
// }


// export { isFeatureCollection };