import Dexie, { Table } from "dexie";
import { VatsimFlight } from "../types";

class VatsimTrafficDB extends Dexie {
    vatsimTraffic!: Table<VatsimFlight, string>;

    constructor() {
        super("VatsimTrafficDB");
        this.version(1)
            .stores({
                vatsimTraffic: `
                &cid, 
                callsign, 
                name, 
                flight_plan.aircraft, 
                flight_plan.aircraft_faa, 
                flight_plan.aircraft_short, 
                flight_plan.arrival, 
                flight_plan.departure, 
                [flight_plan.departure+flight_plan.arrival]`
            });
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
}


const db = new VatsimTrafficDB();

export { db };