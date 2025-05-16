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

interface ControllerInfo {
    name: string;
    frequency: string;
    logon_time: string;
    callsign: string;
}

interface UseMatchedFirFeaturesReturn {
    matchedFirs: MatchedFir[];
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
    "SAM-W",
];

const useMatchedFirs = (controllerInfo: VatsimControllers | null): UseMatchedFirFeaturesReturn => {
    const [matchedFirs, setMatchedFirs] = useState<MatchedFir[]>([]);
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

    const addFirToMap = (
        uniqueId: string,
        fir: MergedFirMatching,
        controller: ControllerInfo,
        isInFss: boolean
    ) => {
        if (firMap.has(uniqueId)) {
            // This means the fir already added
            const existingFir = firMap.get(uniqueId);
            // we need to change the isFss flag and isInFss flag, also add new controller
            existingFir.isInFss = isInFss || existingFir.isInFss;
            // add new controller
            existingFir.controllers.push(controller);
        } else {
            // if fir not in the firMap, add new fir to the map
            firMap.set(uniqueId, {
                id: uniqueId,
                controllers: [controller],
                firInfo: fir,
                isInFss: isInFss,
            });
        }
    };

    async function _findMatchingFss(controller: Fss) {
        try {
            const cleanedCallsign = cleanCallsign(controller.callsign);
            const newController: ControllerInfo = {
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
                    returnedFirList.firs.forEach((fir) => {
                        addFirToMap(fir.uniqueId, fir, newController, true);
                    });
                }
            } else {
                // Try to find if FIR is FSS
                const foundFir = await findMatchingFir(controller.callsign, true);
                if (foundFir) {
                    addFirToMap(foundFir.uniqueId, foundFir, newController, true);
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
            const foundFir = await findMatchingFir(controller.callsign, false);
            if (foundFir) {
                addFirToMap(foundFir.uniqueId, foundFir, newController, false);
            }
        } catch (e) {
            console.error(`Failed to match FIR for ${controller.callsign}: `, e);
        }
    }

    async function findMatchingFir(
        callsign: string,
        isFss: boolean
    ): Promise<MergedFirMatching | null> {
        // firMap.clear();
        const cleanedCallsign = cleanCallsign(callsign);
        const parts = cleanedCallsign.split("_");

        let lastValidMatch = null;

        for (let i = 1; i <= parts.length; i++) {
            const partialCallsign = parts.slice(0, i).join("_");

            const matchingFir = await db.fir
                .where("callsignPrefix")
                .equals(partialCallsign)
                .or("icao")
                .equals(partialCallsign)
                .toArray();

            if (matchingFir && matchingFir.length > 0) {
                let filteredFirs: MergedFirMatching[];

                if (isFss) {
                    // Prefer FIRs with oceanic = 1 when isFss is true
                    filteredFirs = matchingFir.filter((fir) =>
                        fir.entries.some((entry) => entry.oceanic === "1")
                    );
                    if (filteredFirs.length === 0) {
                        // Fallback to FIRs with oceanic = 0 if none are found with oceanic = 1
                        filteredFirs = matchingFir;
                    }
                } else {
                    // Prefer FIRs with oceanic = 0 when isFss is false
                    filteredFirs = matchingFir.filter((fir) =>
                        fir.entries.some((entry) => entry.oceanic === "0")
                    );
                    if (filteredFirs.length === 0) {
                        // Fallback to FIRs with oceanic = 1 if none are found with oceanic = 0
                        filteredFirs = matchingFir;
                    }
                }

                lastValidMatch = filteredFirs[0];
            } else {
                break;
            }
        }
        return lastValidMatch;
    }

    useEffect(() => {
        if (!controllerInfo) return;
        // firMap.clear(); //to prevent stale data
        const fetchMatchedFirs = async () => {
            try {
                // Handle FIR controllers
                await Promise.all(controllerInfo?.fir.map((fir) => _findMatchingFir(fir)));

                // Handle FSS controllers
                await Promise.all(controllerInfo?.fss.map((fss) => _findMatchingFss(fss)));

                setMatchedFirs(Array.from(firMap.values()));
            } catch (error) {
                console.error("Failed to fetch matched FIRs:", error);
                setIsError(true);
            }
        };

        fetchMatchedFirs();
    }, [controllerInfo]);
    return {
        matchedFirs,
        isError,
    };
};

export default useMatchedFirs;
