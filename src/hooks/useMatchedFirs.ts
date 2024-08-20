import GeoJson from "geojson";
import { useEffect, useState } from "react";
import { Fss, VatsimControllers } from "../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { db } from "../database/db";
import { MergedFirMatching, MergedFssMatching } from "../types";

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

    const cleanCallsign = (callsign: string) => {
        return (callsign.endsWith("_CTR") || callsign.endsWith("_FSS")) ? callsign.slice(0, -4) : callsign;
    };

    async function findMatchingFss(callsign: string, results: MatchedFir[], controller: Fss): Promise<MergedFssMatching | null> {
        const testResult = await db.fir
            .filter((f) => {
                return f.callsignPrefix.toLowerCase()
                    .includes("edmm_zug");
            })
            .toArray();
        console.log("TEST RESULTS:", testResult);

        const cleanedCallsign = cleanCallsign(callsign);
        let result = null;

        if (fssCallsign.includes(cleanedCallsign)) {
            result = await db.fss
                .where("fssCallsign")
                .equals(cleanedCallsign)
                .first();

            if (result) {
                for (const fir of result.firs) {
                    // If the FIR has more than one entry, filter by oceanic = "1"
                    if (fir.entries.length > 1) {
                        fir.entries = fir.entries.filter(entry => entry.oceanic === "1");
                    }

                    // Check if the FIR is already in the results
                    const existingFir = results.find(firEntry => firEntry.id.startsWith(fir.icao));

                    if (existingFir) {
                        // Mark as in FSS and append the controller
                        existingFir.isInFss = true;
                        existingFir.firInfo.isFss = true;
                        existingFir.firInfo.fssName = result!.fssName;
                        existingFir.controllers.push({
                            name: controller.name,
                            frequency: controller.frequency,
                            logon_time: controller.logon_time,
                            callsign: controller.callsign,
                        });
                    } else {
                        // Add as a new FSS FIR with the controller and filtered entries
                        results.push({
                            id: `${fir.icao}_${callsign}`,
                            controllers: [
                                {
                                    name: controller.name,
                                    frequency: controller.frequency,
                                    logon_time: controller.logon_time,
                                    callsign: controller.callsign,
                                }
                            ],
                            firInfo: {
                                ...fir,
                                isFss: true,
                                fssName: result!.fssName
                            },
                            isInFss: false
                        });
                    }
                }
            }
        } else {
            // If the FIR is not within the FSS, find it separately
            const matchedFir = await findMatchingFir(callsign);
            if (matchedFir) {
                // Check if the FIR is already in the results
                const existingFir = results.find(firEntry => firEntry.id.startsWith(matchedFir.icao));

                if (existingFir) {
                    // Mark as in FSS and append the controller
                    existingFir.isInFss = true;
                    existingFir.firInfo.isFss = true;
                    existingFir.firInfo.fssName = null;
                    existingFir.controllers.push({
                        name: controller.name,
                        frequency: controller.frequency,
                        logon_time: controller.logon_time,
                        callsign: controller.callsign,
                    });
                } else {
                    // Add as a new FSS FIR with the controller and filtered entries
                    const entry = matchedFir.entries.length > 1
                        ? matchedFir.entries.find(e => e.oceanic === "1")
                        : matchedFir.entries[0];

                    results.push({
                        id: `${matchedFir.icao}_${callsign}`,
                        controllers: [
                            {
                                name: controller.name,
                                frequency: controller.frequency,
                                logon_time: controller.logon_time,
                                callsign: controller.callsign,
                            }
                        ],
                        firInfo: {
                            ...matchedFir,
                            isFss: true,
                            fssName: null,
                            entries: entry ? [entry] : []
                        },
                        isInFss: false
                    });
                }
            }
        }

        return result;
    }


    async function findMatchingFir(callsign: string): Promise<MergedFirMatching | null> {
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
        const fetchMatchedFirs = async () => {
            try {
                setIsLoading(true);
                setIsError(false);

                const results: MatchedFir[] = [];

                // Handle FIR controllers
                for (const controller of controllerInfo.fir) {
                    const matchedFir = await findMatchingFir(controller.callsign);

                    if (matchedFir) {
                        const entry = matchedFir.entries.find(e => matchedFir.isFss ? e.oceanic === "1" : e.oceanic === "0");

                        results.push({
                            id: `${matchedFir.icao}_${controller.callsign}`,
                            controllers: [
                                {
                                    name: controller.name,
                                    frequency: controller.frequency,
                                    logon_time: controller.logon_time,
                                    callsign: controller.callsign,
                                },
                            ],
                            firInfo: {
                                ...matchedFir,
                                entries: [entry] // Only include the correct entry
                            },
                            isInFss: false,
                        });
                    }
                }

                // Handle FSS controllers
                for (const fss of controllerInfo.fss) {
                    await findMatchingFss(fss.callsign, results, fss);
                }

                setMatchedFirs(results);
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