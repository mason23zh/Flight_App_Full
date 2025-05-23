/**
 * To loading the airport data into the Dexie database
 * This will help searching speed in the Map's search bar
 */

import { db } from "../database/db";
import { useEffect, useState } from "react";
import {
    LocalDbAirport,
    MergedFirMatching,
    MergedFssMatching,
    VatsimTraconMapping,
} from "../types";

export const useInitializeDatabase = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                db.on("versionchange", (event) => {
                    console.log(
                        `Database version change detected. Old version: ${event.oldVersion}`
                    );
                    db.delete().then(() => {
                        console.log("Old database deleted. Reloading the page with new version.");
                    });
                });

                // import airport
                const airportCount = await db.airports.count();
                if (airportCount === 0) {
                    // console.log("Import airport to local db.");
                    const { default: airportData } = await import(
                        "../assets/airport_data/airports_with_location.json"
                    );
                    if (Array.isArray(airportData)) {
                        await db.loadAirports(airportData as unknown as LocalDbAirport[]);
                    } else {
                        throw new Error("Invalid airport data format");
                    }
                }

                //import fir
                const firCount = await db.fir.count();
                if (firCount === 0) {
                    // console.log("Import fir to local db.");
                    const { default: firData } = await import(
                        "../assets/Vatsim/fir-matching-with-suffix.json"
                    );
                    if (Array.isArray(firData)) {
                        await db.loadFir(firData as unknown as MergedFirMatching[]);
                    } else {
                        throw new Error("Invalid fir data format");
                    }
                }

                //import fss
                const fssCount = await db.fss.count();
                if (fssCount === 0) {
                    // console.log("import fss to local db.");
                    const { default: fssData } = await import(
                        "../assets/Vatsim/fss-mapping-with-fir.json"
                    );
                    if (Array.isArray(fssData)) {
                        await db.loadFss(fssData as unknown as MergedFssMatching[]);
                    } else {
                        throw new Error("Invalid fss data format");
                    }
                }

                //import tracon
                const traconCount = await db.tracon.count();
                if (traconCount === 0) {
                    const { default: traconData } = await import(
                        "../assets/Vatsim/vatsim-tracon-mapping.json"
                    );
                    if (Array.isArray(traconData)) {
                        await db.loadTracon(traconData as unknown as VatsimTraconMapping[]);
                    } else {
                        throw new Error("Invalid tracon data format");
                    }
                }

                setIsInitialized(true);
            } catch (e) {
                console.error("Failed to load local data into Local db:", e);
            }
        };

        initializeDatabase();

        return () => {
            db.on("versionchange", null);
        };
    }, []);

    return isInitialized;
};
