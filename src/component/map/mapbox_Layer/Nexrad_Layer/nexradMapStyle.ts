import { RasterLayer } from "mapbox-gl";

export const nexradLayerStyle: RasterLayer = {
    id: "nexrad-layer",
    type: "raster",
    source: "nexrad-source",
    paint: {
        "raster-opacity": 0.5,
    },
};
