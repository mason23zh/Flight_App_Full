/*
* Using WebMercatorViewport to filter out the traffic that not within the viewport
* */
import { WebMercatorViewport } from "@deck.gl/core/typed";
import { VatsimFlight } from "../../types";

interface Viewport {
    longitude: number;
    latitude: number;
    zoom: number;
    width: number; //screen width
    height: number; //screen height
}

const filterTrafficDataInViewport = (
    trafficData: VatsimFlight[],
    viewport: Viewport): VatsimFlight[] => {

    const {
        latitude,
        longitude,
        zoom,
        width,
        height
    } = viewport;

    //using WebMercatorViewport to get bounds of current viewport
    const viewportBounds = new WebMercatorViewport({
        longitude,
        latitude,
        zoom,
        width,
        height
    }).getBounds();

    const [minLng, minLat, maxLng, maxLat] = viewportBounds;

    if (trafficData.length === 0) return [];

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
};

export default filterTrafficDataInViewport;