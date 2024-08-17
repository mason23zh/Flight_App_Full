/*
* This function will wrap the longitude for viewport bounds that calculated by the
* WebMercatorViewport.
* */
export const wrapLongitudeForBounds =
        (bounds: [number, number, number, number]): [number, number, number, number] => {
            const [minLng, minLat, maxLng, maxLat] = bounds;

            const wrappedMinLng = minLng < -180 ? minLng + 360 : (minLng > 180 ? minLng - 360 : minLng);
            const wrappedMaxLng = maxLng < -180 ? maxLng + 360 : (maxLng > 180 ? maxLng - 360 : maxLng);

            return [wrappedMinLng, minLat, wrappedMaxLng, maxLat];
        };