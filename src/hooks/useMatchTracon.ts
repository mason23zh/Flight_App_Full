import { Controller, VatsimControllers, VatsimTraconMapping } from "../types";
import { useEffect, useState } from "react";
import { db } from "../database/db";
import { calculateEdgeCoordinates } from "../util/calculateEdgeCoordinates";
import { createMultiPolygonCircle } from "../component/2d/mapbox_Layer/util/createMultiPolygonCircle";
import { Feature, GeoJSON, MultiPolygon, Polygon } from "geojson";

export interface MatchedTracon {
    controllers: {
        name: string;
        frequency: string;
        logon_time: string;
        callsign: string;
    }[];
    traconInfo: VatsimTraconMapping;
}

interface UseMatchTraconReturn {
    isLoading: boolean;
    isError: boolean;
    matchedTracons: MatchedTracon[];
    fallbackGeoJson: GeoJSON.FeatureCollection | null;
    matchedFallbackTracons: FallbackTracon[] | null;
}

export interface FallbackTracon {
    center: number[];
    radius: number;
    controllers: Controller[],
    edgeCoordinates: number[]; // for marker render
}

const useMatchTracon = (controllerData: VatsimControllers): UseMatchTraconReturn => {
    const matchedTraconMap: Map<string, MatchedTracon> = new Map();
    const fallbackTraconMap: Map<string, FallbackTracon> = new Map();
    const fallbackTraconGeoJsonMap: Map<string, Feature<Polygon | MultiPolygon>> = new Map();
    const [matchedFallbackTracons, setMatchedFallbackTracons] = useState<FallbackTracon[] | null>(null);
    const [matchedTracons, setMatchedTracons] = useState<MatchedTracon[] | null>(null);
    const [fallbackGeoJson, setFallbackGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const addToFallbackGeoJsonMap = (controller: Controller) => {
        const callsignPrefix = controller.callsign.slice(0, -4);
        if (fallbackTraconGeoJsonMap.has(callsignPrefix)) {
            return;
        } else {
            const center = [Number(controller.coordinates[0]), Number(controller.coordinates[1])];
            const radius = Number(controller.visual_range || 120);
            const option = {
                steps: 40,
                units: "kilometers"
            };
            fallbackTraconGeoJsonMap.set(callsignPrefix, createMultiPolygonCircle(center, radius, option, controller));
        }
    };

    const addToFallbackTraconMap = (controller: Controller) => {
        const callsignPrefix = controller.callsign.slice(0, -4);

        if (fallbackTraconMap.has(callsignPrefix)) {
            const existingTracon = fallbackTraconMap.get(callsignPrefix);
            existingTracon.controllers.push(controller);
        } else {
            const center = [Number(controller.coordinates[0]), Number(controller.coordinates[1])];
            const radius = Number(controller.visual_range || 120);

            const edgeCoordinates = fallbackTraconGeoJsonMap
                .get(callsignPrefix)?.geometry?.coordinates[0][0][0] as number[] ||
                    calculateEdgeCoordinates(center, radius);

            const tempFallbackObj: FallbackTracon = {
                center: center,
                radius: radius,
                controllers: [controller],
                edgeCoordinates: edgeCoordinates
            };
            fallbackTraconMap.set(callsignPrefix, tempFallbackObj);
        }
    };

    const addToMap = (matchedTracon: VatsimTraconMapping, controller: Controller) => {
        const newController = {
            name: controller.name,
            frequency: controller.frequency,
            logon_time: controller.logon_time,
            callsign: controller.callsign,
        };
        if (matchedTraconMap.has(matchedTracon.id)) {
            const existingTracon = matchedTraconMap.get(matchedTracon.id);
            existingTracon.controllers.push(newController);
        } else {
            const newMatchedTraconObj: MatchedTracon = {
                controllers: [newController],
                traconInfo: matchedTracon,
            };
            matchedTraconMap.set(matchedTracon.uniqueId, newMatchedTraconObj);
        }
    };

    const findMatchingTracons = async (controller: Controller) => {
        let isAppSuffix = false;
        let callsign = controller.callsign;
        if (callsign.endsWith("APP")) {
            isAppSuffix = true;
            callsign = callsign.slice(0, -4);
        } else if (callsign.endsWith("DEP")) {
            callsign = callsign.slice(0, -4);
        }

        const callsignParts = callsign.split("_");

        let matched = false;

        for (let i = callsignParts.length; i > 0; i--) {
            const prefix = callsignParts.slice(0, i)
                .join("_");

            const matches = await db.tracon
                .where("prefix")
                .anyOfIgnoreCase(prefix)
                .toArray();

            if (matches.length === 1) {
                addToMap(
                    {
                        ...matches[0],
                        suffix: isAppSuffix ? "APP" : "DEP",
                        callsignPrefix: prefix,
                    },
                    controller
                );
                matched = true;
                break;
            }
        }

        if (!matched) {
            addToFallbackGeoJsonMap(controller);
            addToFallbackTraconMap(controller);
        }
    };

    useEffect(() => {
        matchedTraconMap.clear();
        fallbackTraconMap.clear();
        fallbackTraconGeoJsonMap.clear();
        const fetchMatchedTracons = async () => {
            if (!controllerData || controllerData.tracon.length === 0) {
                setIsError(true);
                setIsLoading(false);
                setMatchedTracons([]);
                return;
            }

            try {
                setIsLoading(true);
                setIsError(false);

                await Promise.all(controllerData.tracon.map(tracon => findMatchingTracons(tracon)));
                setMatchedTracons(Array.from(matchedTraconMap.values()));
                setFallbackGeoJson({
                    type: "FeatureCollection",
                    features: [...Array.from(fallbackTraconGeoJsonMap.values())]
                });
                setMatchedFallbackTracons(Array.from(fallbackTraconMap.values()));
            } catch (e) {
                console.error("Failed to fetch matched Tracon:", e);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchedTracons();
    }, [controllerData]);


    return {
        matchedTracons,
        fallbackGeoJson,
        matchedFallbackTracons,
        isLoading,
        isError,
    };
};

export default useMatchTracon;
