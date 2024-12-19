import GeoJsonTerminator from "@webgeodatavore/geojson.terminator";

export function getDayNightTerminator() {
    const geoJSON = new GeoJsonTerminator();

    if (geoJSON) {
        return geoJSON;
    } else {
        return null;
    }
}

