import { Controller, VatsimControllers, VatsimTraconMapping } from "../types";
import { useEffect, useState } from "react";
import { db } from "../database/db";


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
}

const useMatchTracon = (controllerData: VatsimControllers): UseMatchTraconReturn => {
    const matchedTraconMap: Map<string, MatchedTracon> = new Map();
    const [matchedTracons, setMatchedTracons] = useState<MatchedTracon[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


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

        let matches: VatsimTraconMapping[] = [];

        const stack = [...callsignParts];

        while (stack.length > 0) {
            const prefix = stack.join("_");
            console.log("PREFIX:", prefix);

            matches = await db.tracon
                .where("prefix")
                .anyOfIgnoreCase(prefix)
                .toArray();

            if (matches.length === 1) {
                addToMap(
                    {
                        ...matches[0],
                        suffix: isAppSuffix ? "APP" : "DEP"
                    },
                    controller
                );
                break;
            }

            stack.pop();
        }
    };

    useEffect(() => {
        matchedTraconMap.clear();
        const fetcheMatchedTracons = async () => {
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
            } catch (e) {
                console.error("Failed to fetch matched Tracon:", e);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetcheMatchedTracons();
    }, [controllerData]);

    // TODO: Miss matching here.
    console.log("Matched tracons:", matchedTracons);

    return {
        matchedTracons,
        isLoading,
        isError,
    };
};

export default useMatchTracon;