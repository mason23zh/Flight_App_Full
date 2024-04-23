import { VatsimControllers, VatsimFirs } from "../types";
import GeoJson from "geojson";
import { useState } from "react";

const useMatchFssFeatures = (
    controllerInfo: VatsimControllers,
    firData: VatsimFirs,
    geoJsonData: GeoJson.FeatureCollection) => {

    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>();


    // if (firData && controllerInfo) {
    //     controllerInfo.fss.forEach((fssController) => {
    //         let geoJsonFeatureList = [];
    //         fssController.
    //     });
    // }

};