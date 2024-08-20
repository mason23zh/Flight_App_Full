import { useEffect, useState } from "react";
import { Fir, Fss, VatsimControllers } from "../types";
import { db } from "../database/db";
import { MergedFirMatching } from "../types";

export interface MatchedFir {
    id: string;
    controllers: {
        name: string;
        frequency: string;
        logon_time: string;
        callsign: string;
    }[];
    firInfo: MergedFirMatching;
    isInFss: boolean;
}

interface UseMatchedFirFeaturesReturn {
    matchedFirs: MatchedFir[];
    isLoading: boolean;
    isError: boolean;
}

const fssCallsign = [
    "ADR_U",
    "AFRN",
    "AFRC",
    "AFRE",
    "AFRS",
    "AFRW",
    "ASEA_N",
    "ASEA_S",
    "ASEA",
    "ASIA",
    "BALT",
    "BICC",
    "CARI",
    "CARE",
    "CARW",
    "ANT",
    "EURN",
    "EUC-EN",
    "EUC-ES",
    "EUC-ME",
    "EUC-MW",
    "EUC-SE",
    "EUC-SW",
    "EUC-WN",
    "EUC-WS",
    "GULF",
    "GULF_E",
    "GULF_W",
    "LFUP",
    "LIUP",
    "LRUB",
    "PRC",
    "RU-ERC",
    "RU-WRC",
    "RU-ESC",
    "RU-WSC",
    "RU-CEN",
    "RU-NWC",
    "RU-SC",
    "SAM-N",
    "SAM-E",
    "SAM-S",
    "SAM-W"
];


const useMatchedFirs = (
    controllerInfo: VatsimControllers,
): UseMatchedFirFeaturesReturn => {
    const [matchedFirs, setMatchedFirs] = useState<MatchedFir[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const firMap: Map<string, MatchedFir> = new Map();

    const cleanCallsign = (callsign: string) => {
        const suffixes = ["_CTR", "_FSS"];
        for (const suffix of suffixes) {
            if (callsign.endsWith(suffix)) {
                return callsign.slice(0, -suffix.length);
            }
        }
        return callsign;
    };


    async function _findMatchingFss(controller: Fss) {
        try {
            const cleanedCallsign = cleanCallsign(controller.callsign);
            const newController = {
                name: controller.name,
                frequency: controller.frequency,
                logon_time: controller.logon_time,
                callsign: controller.callsign,
            };
            if (fssCallsign.includes(cleanedCallsign)) {
                const returnedFirList = await db.fss
                    .where("fssCallsign")
                    .equalsIgnoreCase(cleanedCallsign)
                    .first();
                if (returnedFirList) {
                    returnedFirList.firs.forEach(fir => {
                        const uniqueId = fir.uniqueId;

                        if (firMap.has(uniqueId)) {
                            // This means the fir already added
                            // we need to change the isFss flag and isInFss flag, also add new controller
                            const existingFir = firMap.get(uniqueId);
                            existingFir.isInFss = true;
                            existingFir.controllers.push(newController);
                        } else {
                            // add the fir into the map
                            firMap.set(uniqueId, {
                                id: fir.uniqueId,
                                controllers: [newController],
                                firInfo: fir,
                                isInFss: false
                            });
                        }
                    });
                }
            } else {
                // Try to find if FIR is FSS
                const foundFir = await findMatchingFir(controller.callsign);
                if (foundFir) {
                    // check if this fir is already in the firMap
                    // if so, change the isInFss flag
                    if (firMap.has(foundFir.uniqueId)) {
                        const firInMap = firMap.get(foundFir.uniqueId);
                        firInMap.isInFss = true;
                        firInMap.controllers.push(newController);
                    } else {
                        // add the fir in to the map, and set isFss flag to true
                        firMap.set(foundFir.uniqueId, {
                            id: foundFir.uniqueId,
                            controllers: [newController],
                            firInfo: foundFir,
                            isInFss: false
                        });
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to match FSS for ${controller.callsign}: `, e);
        }
    }


    async function _findMatchingFir(controller: Fir) {
        try {
            const newController = {
                name: controller.name,
                frequency: controller.frequency,
                logon_time: controller.logon_time,
                callsign: controller.callsign,
            };
            const foundFir = await findMatchingFir(controller.callsign);
            if (foundFir) {
                const uniqueId = foundFir.uniqueId;
                // find if the fir is already in the firMap
                if (firMap.has(uniqueId)) {
                    const firInMap = firMap.get(uniqueId);
                    firInMap.controllers.push(newController);
                } else {
                    // If fir not in the map, construct a new fir
                    firMap.set(uniqueId, {
                        id: uniqueId,
                        controllers: [newController],
                        firInfo: foundFir,
                        isInFss: false,
                    });
                }
            }
        } catch (e) {
            console.error(`Failed to match FIR for ${controller.callsign}: `, e);
        }
    }


    async function findMatchingFir(callsign: string): Promise<MergedFirMatching | null> {
        // firMap.clear();
        const cleanedCallsign = cleanCallsign(callsign);
        const parts = cleanedCallsign.split("_");

        let lastValidMatch = null;

        for (let i = 1; i <= parts.length; i++) {
            const partialCallsign = parts.slice(0, i)
                .join("_");

            const matchingFir = await db.fir
                .where("callsignPrefix")
                .equals(partialCallsign)
                .first();

            if (matchingFir) {
                lastValidMatch = matchingFir;
            } else {
                break;
            }
        }
        return lastValidMatch;
    }

    useEffect(() => {
        firMap.clear(); //to prevent stale data
        const fetchMatchedFirs = async () => {
            try {
                setIsLoading(true);
                setIsError(false);

                // Handle FIR controllers
                await Promise.all(controllerInfo.fir.map(fir => _findMatchingFir(fir)));

                // Handle FSS controllers
                await Promise.all(controllerInfo.fss.map(fss => _findMatchingFss(fss)));

                setMatchedFirs(Array.from(firMap.values()));
            } catch (error) {
                console.error("Failed to fetch matched FIRs:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchedFirs();
    }, [controllerInfo]);
    return {
        matchedFirs,
        isLoading,
        isError
    };
};

export default useMatchedFirs;