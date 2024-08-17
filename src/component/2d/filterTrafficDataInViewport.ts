/*
* Using WebMercatorViewport to filter out the traffic that not within the viewport
* */
import { VatsimFlight } from "../../types";
import { wrapLongitudeForBounds } from "../../util/wrapLongitudeForViewportBounds";

const filterTrafficDataInViewport = (
    trafficData: VatsimFlight[],
    currentBounds: [number, number, number, number],
    previousBounds: [number, number, number, number] | null,
    currentZoom: number,
    previousZoom: number | null,
    isDragging: boolean
): VatsimFlight[] => {
    // const [minLng, minLat, maxLng, maxLat] = currentBounds;

    if (trafficData.length === 0) return [];

    const zoomChanged = previousZoom === null || currentZoom !== previousZoom;

    // Need to wrap the longitude to display traffic from both east and west hemisphere
    const currentBoundsWrapped = wrapLongitudeForBounds(currentBounds);
    const previousBoundsWrapped = wrapLongitudeForBounds(previousBounds);

    const filterDataInBounds = (
        bounds: [number, number, number, number],
        data: VatsimFlight[]
    ): VatsimFlight[] => {
        const [minLng, minLat, maxLng, maxLat] = bounds;


        if (minLng > maxLng) {
            // Handle map wrapping: split into two ranges
            return data.filter(({
                longitude,
                latitude
            }) => {
                return (
                    latitude >= minLat &&
                        latitude <= maxLat &&
                        (longitude >= minLng || longitude <= maxLng)
                );
            });
        } else {
            return data.filter(({
                longitude,
                latitude
            }) => {
                return (
                    longitude >= minLng &&
                        longitude <= maxLng &&
                        latitude >= minLat &&
                        latitude <= maxLat
                );
            });
        }
    };
    if (!zoomChanged && isDragging && previousBounds) {
        return filterDataInBounds(previousBoundsWrapped, trafficData);
    } else {
        return filterDataInBounds(currentBoundsWrapped, trafficData);
    }
};

export default filterTrafficDataInViewport;