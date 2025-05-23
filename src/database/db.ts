import Dexie, { Table } from "dexie";
import aircraftData from "../assets/aircraft_data/aircraft.json";
import {
    FirFeature,
    LocalDbAirport,
    MergedFirMatching,
    MergedFssMatching,
    VatsimFlight,
} from "../types";
import { VatsimTraconMapping } from "../types";

class VatsimLocalDB extends Dexie {
    vatsimTraffic!: Table<VatsimFlight, number>;
    airports!: Table<LocalDbAirport, string>;
    fir!: Table<MergedFirMatching, string>;
    fss!: Table<MergedFssMatching, string>;
    tracon!: Table<VatsimTraconMapping, string>;
    firBoundaries!: Table<FirFeature, string>;

    constructor() {
        super("LocalVatsimDB");
        this.version(2).stores({
            vatsimTraffic: `&cid, 
                        callsign, 
                        name, 
                        flight_plan.aircraft, 
                        flight_plan.aircraft_faa, 
                        flight_plan.aircraft_short, 
                        flight_plan.aircraft_name,
                        flight_plan.aircraft_iata,
                        flight_plan.arrival, 
                        flight_plan.departure, 
                        [flight_plan.departure+flight_plan.arrival]`,

            airports: `&ident, 
                            gps_code, 
                            iata_code, 
                            municipality,
                            name`,
            fir: `&uniqueId,
                        icao,
                        callsignPrefix,
                        firBoundary`,
            fss: `&fssCallsign, 
                          fssName`,
            tracon: `&uniqueId,id,
                            *prefix`,
        });
    }

    #chunkArray(array: VatsimFlight[], size: number) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }

        return result;
    }

    async syncVatsimTraffic(newData: VatsimFlight[]) {
        const currentKeys = await this.vatsimTraffic.toCollection().primaryKeys();
        const newKeys = newData.map((item) => item.cid);
        const keysToRemove = currentKeys.filter((key) => !newKeys.includes(Number(key)));

        // Append aircraft data to VatsimFlight to include aircraft name and iata code
        const updatedData = newData.map((flight) => {
            if (flight.flight_plan) {
                //some traffic may not have flight plan
                const aircraft = aircraftData.find(
                    (mapping) => mapping.icao === flight.flight_plan.aircraft_short
                );
                let updatedFlightPlan = { ...flight.flight_plan };

                if (aircraft) {
                    updatedFlightPlan = {
                        ...flight.flight_plan,
                        aircraft_name: aircraft.name,
                        aircraft_iata: aircraft.iata,
                    };
                }

                return {
                    ...flight,
                    flight_plan: updatedFlightPlan,
                };
            } else {
                return flight;
            }
        });

        const chunks = this.#chunkArray(updatedData, 500);

        for (const chunk of chunks) {
            await this.transaction("rw", this.vatsimTraffic, async () => {
                await this.vatsimTraffic.bulkPut(chunk);
                await this.vatsimTraffic.bulkDelete(keysToRemove);
            });
        }
    }

    async loadAirports(newData: LocalDbAirport[]) {
        const validAirportData = newData.filter((airport) => airport.ident);
        await this.airports.clear();
        await this.airports.bulkPut(validAirportData);
    }

    async loadFir(newData: MergedFirMatching[]) {
        const validFirData = newData.filter((fir) => fir.uniqueId);
        await this.fir.clear();
        await this.fir.bulkPut(validFirData);
    }

    async loadFss(newData: MergedFssMatching[]) {
        const validFssData = newData.filter((fss) => fss.fssCallsign);
        await this.fss.clear();
        await this.fss.bulkPut(validFssData);
    }

    async loadTracon(newData: VatsimTraconMapping[]) {
        const validTraconData = newData.filter((tracon) => tracon.uniqueId);
        await this.tracon.clear();
        await this.tracon.bulkPut(validTraconData);
    }
}

const db = new VatsimLocalDB();

export { db };
