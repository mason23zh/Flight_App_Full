import Dexie, { Table } from "dexie";
import { LocalDbAirport, VatsimFlight } from "../types";

class VatsimLocalDB extends Dexie {
    vatsimTraffic!: Table<VatsimFlight, number>;
    airports!: Table<LocalDbAirport, string>;

    constructor() {
        super("LocalVatsimDB");
        this.version(1)
            .stores(
                {
                    vatsimTraffic: `&cid, 
                        callsign, 
                        name, 
                        flight_plan.aircraft, 
                        flight_plan.aircraft_faa, 
                        flight_plan.aircraft_short, 
                        flight_plan.arrival, 
                        flight_plan.departure, 
                        [flight_plan.departure+flight_plan.arrival]`,

                    airports: `&ident, 
                            gps_code, 
                            iata_code, 
                            municipality,
                            name`,
                },
            );
    }

    async syncVatsimTraffic(newData: VatsimFlight[]) {
        const currentKeys = await this.vatsimTraffic.toCollection()
            .primaryKeys();
        const newKeys = newData.map(item => item.cid);
        const keysToRemove = currentKeys.filter(key => !newKeys.includes(Number(key)));

        await this.transaction("rw", this.vatsimTraffic, async () => {
            await this.vatsimTraffic.bulkPut(newData);
            await this.vatsimTraffic.bulkDelete(keysToRemove);
        });
    }

    async loadAirports(newData: LocalDbAirport[]) {
        const validAirportData = newData.filter(airport => airport.ident);
        await this.airports.clear();
        await this.airports.bulkPut(validAirportData);
    }
}


const db = new VatsimLocalDB();

export { db };