/**
 * To loading the airport data into the Dexie database
 * This will help searching speed in the Map's search bar
 */

import { db } from "../database/db";
import airportData from "../assets/airport_data/airports_with_location.json";
import { useEffect, useState } from "react";
import { LocalDbAirport } from "../types";

export const useInitializeDatabase = () => {
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                const airportCount = await db.airports.count();
                if (airportCount === 0) {
                    console.log("Import airport to local db.");
                    await db.loadAirports(airportData as LocalDbAirport[]);
                }
                setIsInitialized(true);
            } catch (e) {
                console.error("Failed to load airport into Local db:", e);
            }
        };

        initializeDatabase();
    }, []);

    return isInitialized;
};
