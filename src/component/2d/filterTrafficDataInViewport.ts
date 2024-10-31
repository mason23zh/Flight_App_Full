/*
* Using WebMercatorViewport to filter out the traffic that not within the viewport
* */
import { VatsimFlight } from "../../types";
import { wrapLongitudeForBounds } from "../../util/wrapLongitudeForViewportBounds";

const filterTrafficDataInViewport = (
    trafficData: VatsimFlight[],
    currentBounds: [number, number, number, number] | null,
): VatsimFlight[] => {
    //TODO: Bug in the wrapLongitudeForBounds function, if zoom number too small the wrapping is wrong.
    if (trafficData.length === 0 || !currentBounds) return [];


    // Need to wrap the longitude to display traffic from both east and west hemisphere
    const currentBoundsWrapped = wrapLongitudeForBounds(currentBounds);

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

    return filterDataInBounds(currentBoundsWrapped, trafficData);
};

export default filterTrafficDataInViewport;