export const calculateGreatCirclePoints = (start: number[], end: number[], numPoints = 100) => {
    const coordinates = [];
    const [lon1, lat1] = start.map(deg => deg * Math.PI / 180); // Convert degrees to radians
    const [lon2, lat2] = end.map(deg => deg * Math.PI / 180);

    // Haversine Formula to calculate the angular distance between points
    const deltaX = lon2 - lon1;
    const deltaY = lat2 - lat1;
    const a = Math.sin(deltaY / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaX / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const angularDistance = c;

    for (let i = 0; i <= numPoints; i++) {
        const f = i / numPoints;

        // Spherical Interpolation
        const A = Math.sin((1 - f) * angularDistance) / Math.sin(angularDistance);
        const B = Math.sin(f * angularDistance) / Math.sin(angularDistance);
        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
        const lon = Math.atan2(y, x);

        coordinates.push([lon * 180 / Math.PI, lat * 180 / Math.PI]); // Convert back to degrees
    }

    return coordinates;
};
