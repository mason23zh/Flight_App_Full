/*
* Using WebMercatorViewport to filter out the traffic that not within the viewport
* */
import { VatsimFlight } from "../../types";

const filterTrafficDataInViewport = (
    trafficData: VatsimFlight[],
    currentBounds: [number, number, number, number],
    previousBounds: [number, number, number, number] | null,
    currentZoom: number,
    previousZoom: number | null,
    isDragging: boolean
): VatsimFlight[] => {

    const [minLng, minLat, maxLng, maxLat] = currentBounds;

    if (trafficData.length === 0) return [];

    const zoomChanged = previousZoom === null || currentZoom !== previousZoom;

    if (!zoomChanged && isDragging && previousBounds) {
        const [prevMinLng, prevMinLat, prevMaxLng, prevMaxLat] = previousBounds;

        return trafficData.filter(({
            longitude,
            latitude
        }) => {
            return (
                longitude >= prevMinLng &&
                    longitude <= prevMaxLng &&
                    latitude >= prevMinLat &&
                    latitude <= prevMaxLat
            );
        });
    } else {
        return trafficData.filter(({
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

export default filterTrafficDataInViewport;