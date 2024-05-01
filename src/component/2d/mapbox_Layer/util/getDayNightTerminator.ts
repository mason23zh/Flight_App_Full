import { sunCoords, toDays } from "./SunCalc";
import GeoJsonTerminator from "@webgeodatavore/geojson.terminator";
import VectorLayer from "ol/layer/Vector";
import { Fill, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

function calculateTerminatorLine(date) {
    const terminatorCoords = [];
    const days = toDays(date);

    for (let lng = -180; lng <= 180; lng += 1) {
        // For each longitude, we find the latitude where the sun is at the horizon
        const {
            sinDec,
            cosDec
        } = sunCoords(days);

        // Calculate latitude where the sun is on the horizon
        const latitude = Math.asin(sinDec) / Math.PI * 180; // Convert from radians to degrees

        terminatorCoords.push([lng, latitude]);
    }

    return terminatorCoords;
}

export function getDayNightTerminator() {
    const geoJSON = new GeoJsonTerminator();
    // const timeLayer = new VectorLayer({
    //     source: new VectorSource({
    //         features: (new GeoJSON()).readFeatures(geoJSON, {
    //             featureProjection: "EPSG:3857"
    //         })
    //     }),
    //     style: new Style({
    //         fill: new Fill({
    //             color: "rgb(0, 0, 0)"
    //         }),
    //         stroke: null
    //     }),
    //     opacity: 0.5
    // });


    return geoJSON;
}

