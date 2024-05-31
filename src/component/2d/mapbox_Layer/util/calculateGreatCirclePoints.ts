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

        // Convert back to degrees
        const lonDegrees = lon * 180 / Math.PI;
        const latDegrees = lat * 180 / Math.PI;
        coordinates.push([lonDegrees, latDegrees]);
    }

    // Adjust for crossing the 180° meridian
    // to prevent an extra line drawing across the map
    for (let i = 1; i < coordinates.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [prevLon, prevLat] = coordinates[i - 1];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [currLon, currLat] = coordinates[i];

        if (Math.abs(currLon - prevLon) > 180) {
            if (currLon > prevLon) {
                coordinates[i - 1][0] += 360;
            } else {
                coordinates[i][0] += 360;
            }
        }
    }

    // Normalize longitudes back to the range [-180, 180]
    const normalizedCoordinates = coordinates.map(([lon, lat]) => [wrapLongitude(lon), lat]);

    // Remove the extra line
    const adjustedCoordinates = [];
    for (let i = 0; i < normalizedCoordinates.length - 1; i++) {
        const [currLon, currLat] = normalizedCoordinates[i];
        const [nextLon, nextLat] = normalizedCoordinates[i + 1];
        adjustedCoordinates.push([currLon, currLat]);

        if (Math.abs(nextLon - currLon) > 180) {
            const midpoint = [(currLon + nextLon) / 2, (currLat + nextLat) / 2];
            adjustedCoordinates.push([midpoint[0], midpoint[1]]);
            adjustedCoordinates.push([nextLon, nextLat]);
        }
    }

    adjustedCoordinates.push(normalizedCoordinates[normalizedCoordinates.length - 1]);

    return adjustedCoordinates;
};


const wrapLongitude = (longitude: number) => {
    while (longitude < -180) longitude += 360;
    while (longitude > 180) longitude -= 360;
    return longitude;
};

