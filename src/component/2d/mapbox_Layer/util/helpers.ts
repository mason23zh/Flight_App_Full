import GeoJson from "geojson";
import { AirportService } from "../../../../types";

// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isFeatureCollection(
    feature: GeoJson.FeatureCollection | AirportService
): feature is GeoJson.FeatureCollection {
    return "type" in feature && feature["type"] === "FeatureCollection";
}


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