/*
* To preform spherical interpolation to calculate points along the
* great circle path between 2 geographic coordinates.
*/

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

        // Convert back to degrees and wrap longitude
        const lonDegrees = lon * 180 / Math.PI;
        const latDegrees = lat * 180 / Math.PI;
        coordinates.push([wrapLongitude(lonDegrees), latDegrees]);

    }
    return coordinates;
};


const wrapLongitude = (longitude: number) => {
    while (longitude < -180) longitude += 360;
    while (longitude > 180) longitude -= 360;
    return longitude;
};

