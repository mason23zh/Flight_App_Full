/*
* To preform spherical interpolation to calculate points along the
* great circle path between 2 geographic coordinates.
*/

import * as turf from "@turf/turf";

export const drawGreatCirclePointsFeature = (start: number[], end: number[]) => {

    const startPoint = turf.point(start);
    const endPoint = turf.point(end);

    return turf.greatCircle(startPoint, endPoint);
};