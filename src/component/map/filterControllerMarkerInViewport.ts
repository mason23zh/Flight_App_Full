import { WebMercatorViewport } from "@deck.gl/core/typed";
import { VatsimControllers } from "../../types";
import { wrapLongitudeForBounds } from "../../util/wrapLongitudeForViewportBounds";

interface Viewport {
    longitude: number;
    latitude: number;
    zoom: number;
    width: number;
    height: number;
}

//TODO: Need to handle latitude wrapping
const filterControllerMarkerInViewport = (
    controllerData: VatsimControllers,
    viewport: Viewport
): VatsimControllers => {
    const {
        latitude,
        longitude,
        zoom,
        width,
        height
    } = viewport;

    const viewportBounds = new WebMercatorViewport({
        longitude,
        latitude,
        zoom,
        width,
        height
    }).getBounds();

    const wrappedBounds = wrapLongitudeForBounds(viewportBounds);

    const [minLng, minLat, maxLng, maxLat] = wrappedBounds;


    const controllerInfo = controllerData.other.controllers.filter((controller) => {
        const latitude = Number(controller.coordinates[1]);
        const longitude = Number(controller.coordinates[0]);
        return (
            longitude >= minLng &&
                longitude <= maxLng &&
                latitude >= minLat &&
                latitude <= maxLat
        );
    });
    return {
        ...controllerData,
        other: {
            atis: controllerData.other.atis,
            controllers: controllerInfo
        }
    };
};

export default filterControllerMarkerInViewport;