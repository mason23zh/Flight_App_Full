import traconMapping from "../assets/Vatsim/vatsim-tracon-mapping.json";
import { Controller, VatsimControllers, VatsimTraconMapping } from "../types";
import { useEffect, useState } from "react";
import { db } from "../database/db";


interface MatchedTracon {
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
}

const useMatchTracon = (controller: VatsimControllers) => {
    const matchedTraconMap: Map<string, MatchedTracon> = new Map();
    const [matchedTracons, setMatchedTracons] = useState<MatchedTracon[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    if (!controller?.tracon || controller.tracon.length === 0) {
        setIsError(true);
        return {
            isLoading: false,
            isError: true,
            matchedTracons: []
        };
    }

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
            matchedTraconMap.set(matchedTracon.id, newMatchedTraconObj);
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
        let prefix = callsignParts[0];
        let partIndex = 1;
        let matches: VatsimTraconMapping[] = [];

        while (partIndex <= callsignParts.length) {
            matches = await db.tracon
                .where("prefix")
                .startsWith(prefix)
                .toArray();

            if (matches.length === 1) {
                addToMap(
                    {
                        ...matches[0],
                        suffix: isAppSuffix ? "APP" : "DEP"
                    },
                    controller
                );
            }

            if (partIndex < callsignParts.length) {
                prefix += `_${callsignParts[partIndex]}`;
            }

            partIndex++;
        }
    };

    useEffect(() => {
        matchedTraconMap.clear();
        const fetcheMatchedTracons = async () => {
            try {
                setIsLoading(true);
                setIsError(false);

                await Promise.all(controller.tracon.map(tracon => findMatchingTracons(tracon)));
                setMatchedTracons(Array.from(matchedTraconMap.values()));
            } catch (e) {
                console.error("Failed to fetch matched Tracon:", e);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetcheMatchedTracons();
    }, [controller]);

    // TODO: Miss matching here.
    console.log("Matched tracons:", matchedTracons);

    return {
        matchedTracons,
        isLoading,
        isError,
    };
};

export default useMatchTracon;