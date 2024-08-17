import { VatsimControllers } from "../../../types";
import { useFetchVatsimFirQuery, useFetchVatsimFssQuery } from "../../../store";
import { useEffect, useState } from "react";

const useMatchedFirIds = (controllerInfo: VatsimControllers): string[] => {
    const [matchedFirsIds, setMatchedFirsIds] = useState<string[]>([]);
    const {
        data: firData,
        error: firError,
        isLoading: firLoading
    } = useFetchVatsimFirQuery();

    const {
        data: fssData,
        error: fssError,
        isLoading: fssLoading
    } = useFetchVatsimFssQuery();

    const isLoading = fssLoading || firLoading;
    const isError = firError || fssError;

    useEffect(() => {
        if (isLoading || isError) {
            setMatchedFirsIds([]);
            return;
        }


        let matchedFirs = {};


        if (controllerInfo.fir) {
            matchedFirs = controllerInfo.fir.reduce((acc, controller) => {
                const firKey = controller.firInfo.icao;
                if (!acc[firKey]) {
                    acc[firKey] = {
                        firKey: firKey,
                        controllers: [],
                        firInfo: controller.firInfo,
                        isInFss: false
                    };
                }
                acc[firKey].controllers.push({
                    name: controller.name,
                    frequency: controller.frequency,
                    logon_time: controller.logon_time,
                    callsign: controller.callsign
                });
                return acc;
            }, {});
        }

        // Check FSS data if available
        if (controllerInfo.fss && fssData) {
            controllerInfo.fss.forEach(fss => {
                const fssKey = fss.callsign.replace("_FSS", "");
                if (fssData[fssKey] && fssData[fssKey].firs) {
                    fssData[fssKey].firs.forEach(firKey => {
                        if (!matchedFirs[firKey]) {
                            const firInfo = firData[firKey];
                            if (firInfo) {
                                matchedFirs[firKey] = {
                                    firKey: firKey,
                                    controllers: [{
                                        name: fss.name,
                                        frequency: fss.frequency,
                                        logon_time: fss.logon_time,
                                        callsign: fss.callsign
                                    }],
                                    firInfo: firInfo,
                                    isInFss: true
                                };
                            }
                        } else {
                            matchedFirs[firKey].isInFss = true;
                            matchedFirs[firKey].controllers.push({
                                name: fss.name,
                                frequency: fss.frequency,
                                logon_time: fss.logon_time,
                                callsign: fss.callsign
                            });
                        }
                    });
                } else {
                    // Handle the case where an FSS is actually an FIR with extended range
                    const parts = fss.callsign.replace("_FSS", "")
                        .split("_");
                    let matchFound = false;

                    while (parts.length > 0 && !matchFound) {
                        const potentialMatch = parts.join("_");
                        if (firData[potentialMatch]) {
                            if (!matchedFirs[potentialMatch]) {
                                matchedFirs[potentialMatch] = {
                                    firKey: potentialMatch,
                                    controllers: [],
                                    firInfo: firData[potentialMatch],
                                    isInFss: false
                                };
                            }
                            matchedFirs[potentialMatch].controllers.push({
                                name: fss.name,
                                frequency: fss.frequency,
                                logon_time: fss.logon_time,
                                callsign: fss.callsign
                            });
                            matchFound = true;
                        }
                        parts.pop();
                    }
                }
            });
        }

        setMatchedFirsIds(Object.keys(matchedFirs));
    }, [controllerInfo, firData, fssData]);

    console.log("matchedFirsIds:", matchedFirsIds);
    return matchedFirsIds;
};

export default useMatchedFirIds;