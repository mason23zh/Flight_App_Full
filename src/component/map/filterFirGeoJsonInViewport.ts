import { FeatureCollection, Polygon, MultiPolygon, GeoJSON } from "geojson";
import bbox from "@turf/bbox";
import { wrapLongitudeForBounds } from "../../util/wrapLongitudeForViewportBounds";
import { current } from "@reduxjs/toolkit";


const filterFirGeoJsonInViewport = (
    firGeoJsonData: FeatureCollection<Polygon | MultiPolygon>,
    currentBounds: [number, number, number, number],
    previousBounds: [number, number, number, number] | null,
    currentZoom: number,
    previousZoom: number | null,
    isDragging: boolean
): FeatureCollection<Polygon | MultiPolygon> => {

    if (!firGeoJsonData || firGeoJsonData.features.length === 0) {
        return {
            type: "FeatureCollection",
            features: []
        };
    }


    const zoomChanged = previousZoom === null || currentZoom !== previousZoom;

    // const previousBoundsWrapped = wrapLongitudeForBounds(previousBounds);
    const currentBoundsWrapped = wrapLongitudeForBounds(currentBounds);

    const filterFeaturesInBounds = (
        bounds: [number, number, number, number],
        features: GeoJSON.Feature<Polygon | MultiPolygon>[]
    ): GeoJSON.Feature<Polygon | MultiPolygon>[] => {
        const [minLng, minLat, maxLng, maxLat] = bounds;

        return features.filter((feature) => {
            const featureBbox = bbox(feature);

            return (
                featureBbox[2] >= minLng &&
                    featureBbox[0] <= maxLng &&
                    featureBbox[3] >= minLat &&
                    featureBbox[1] <= maxLat
            );
        });
    };

    const filteredFeatures = !zoomChanged && isDragging && previousBounds
        ? filterFeaturesInBounds(previousBounds, firGeoJsonData.features)
        : filterFeaturesInBounds(currentBounds, firGeoJsonData.features);

    return {
        type: "FeatureCollection",
        features: filteredFeatures
    };
};

export default filterFirGeoJsonInViewport;