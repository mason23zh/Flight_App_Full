import { MatchedFir } from "./useMatchedFirs";
import { db } from "../database/db";
import { useEffect, useState } from "react";
import { FirFeature, FirFeatureCollection } from "../types";

const useGenerateFirGeoJson = (matchedFirs: MatchedFir[]) => {
    const [activeFirFeatures, setActiveFirFeatures] = useState<FirFeature[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState<Error | null>(null);


    useEffect(() => {
        const fetchFirFeature = async () => {
            try {
                setIsLoading(true);
                setIsError(null);
                const promises = matchedFirs.map(matchedFir => {
                    const id = matchedFir.firInfo.firBoundary;
                    const oceanic = matchedFir.firInfo.entries[0]?.oceanic || "0";

                    return db.firBoundaries.get([id, oceanic]);
                });

                const firFeatures = await Promise.all(promises);
                setActiveFirFeatures(firFeatures.filter(feature => feature !== undefined));
            } catch (e) {
                setIsError(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFirFeature();
    }, [matchedFirs]);

    return {
        activeFirFeatures,
        isLoading,
        isError
    };
};

export default useGenerateFirGeoJson;