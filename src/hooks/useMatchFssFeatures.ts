import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useMemo, useState } from "react";
import { useFetchVatsimFirQuery, useFetchVatsimFssQuery } from "../store";

const useMatchFssFeatures = (
    controllerInfo: VatsimControllers,
    geoJsonData: GeoJson.FeatureCollection) => {

    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>();

    const {
        data: fssData,
        error: fssError,
        isLoading: fssLoading
    } = useFetchVatsimFssQuery();

    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery();

    const isLoading = fssLoading || firLoading;
    const error = fssError || firError;

    useMemo(() => {
        if (!controllerInfo || !controllerInfo.fss || !fssData || !firData || !geoJsonData || error) {
            return;
        }

        const combinedFeatures = controllerInfo.fss.reduce((acc, fssEntry) => {
            const prefix = fssEntry.callsign.split("_")[0]; // Extract FSS prefix from callsign
            const fss = fssData[prefix]; // Find the FSS using the prefix
            if (!fss) return acc; // Continue if no FSS is found for the prefix

            const fssFeatures = fss.firs.reduce((fssAcc, firKey) => {
                const firFeatures = geoJsonData.features.filter(feature => {
                    const icao = firData[firKey]?.icao;
                    return feature.properties.id === icao;
                });

                return [...fssAcc, ...firFeatures];
            }, []);

            return [...acc, ...fssFeatures];
        }, []);

        setGeoJsonFeatures({
            type: "FeatureCollection",
            features: combinedFeatures
        });
    }, [controllerInfo, fssData, firData, geoJsonData]);

    return {
        geoJsonFeatures,
        isLoading,
        error
    };
};

export default useMatchFssFeatures;