export const calculateEdgeCoordinates = (center: number[], radius: number): number[] => {
    const earthRadius = 6371000; // Earth's radius in meters
    const radiusInMeters = radius * 1609.34;
    const lat = center[1] * (Math.PI / 180);
    const lon = center[0] * (Math.PI / 180);
    const angularDistance = radiusInMeters / earthRadius;

    const edgeLat = Math.asin(
        Math.sin(lat) * Math.cos(angularDistance) +
            Math.cos(lat) * Math.sin(angularDistance) * Math.cos(0)
    );
    const edgeLon =
        lon +
        Math.atan2(
            Math.sin(0) * Math.sin(angularDistance) * Math.cos(lat),
            Math.cos(angularDistance) - Math.sin(lat) * Math.sin(edgeLat)
        );

    return [edgeLon * (180 / Math.PI), edgeLat * (180 / Math.PI)];
};
