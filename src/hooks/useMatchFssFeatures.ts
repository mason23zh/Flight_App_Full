import { VatsimControllers } from "../types";
import GeoJson from "geojson";
import { useMemo, useState } from "react";
import { setOnlineFssList, useFetchVatsimFirQuery, useFetchVatsimFssQuery } from "../store";
import { useDispatch } from "react-redux";

const useMatchFssFeatures = (
    controllerInfo: VatsimControllers,
    geoJsonData: GeoJson.FeatureCollection) => {

    const dispatch = useDispatch();
    const [geoJsonFeatures, setGeoJsonFeatures] = useState<GeoJson.FeatureCollection>();
    const [matchedFirInFss, setMatchedFirInFss] = useState([]);

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

        const localMatchedFirs = [];
        const combinedFeatures = controllerInfo.fss.reduce((acc, fssEntry) => {
            const prefix = fssEntry.callsign.split("_")[0]; // Extract FSS prefix from callsign
            const fss = fssData[prefix]; // Find the FSS using the prefix
            if (!fss) return acc; // Continue if no FSS is found for the prefix

            // console.log("fss matched:", fssEntry);

            const fssFeatures = fss.firs.reduce((fssAcc, firKey) => {
                const firFeatures = geoJsonData.features.filter(feature => {
                    const icao = firData[firKey]?.icao;
                    return feature.properties.id === icao;
                });

                if (firFeatures.length > 0) {
                    localMatchedFirs.push(firKey);
                }

                // Append controllerInfo details to each GeoJSON feature
                return fssAcc.concat(firFeatures.map(feature => ({
                    ...feature,
                    properties: {
                        ...feature.properties,
                        controllers: [{
                            callsign: fssEntry.callsign,
                            frequency: fssEntry.frequency,
                            logon_time: fssEntry.logon_time,
                            name: fssEntry.name
                        }],
                    }
                })));
            }, []);


            return [...acc, ...fssFeatures];
        }, []);

        setMatchedFirInFss(localMatchedFirs);

        setGeoJsonFeatures({
            type: "FeatureCollection",
            features: combinedFeatures
        });
    }, [controllerInfo, fssData, firData, geoJsonData]);

    /*
    * Dispatch the online FIRs that within the FSS
    */
    if (matchedFirInFss.length > 0) {
        dispatch(setOnlineFssList(matchedFirInFss));
    }

    return {
        geoJsonFeatures,
        isLoading,
        error
    };
};

export default useMatchFssFeatures;