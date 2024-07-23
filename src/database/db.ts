import Dexie, { Table } from "dexie";
import aircraftData from "../assets/aircraft_data/aircraft.json";
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
                },
            );
    }

    async syncVatsimTraffic(newData: VatsimFlight[]) {
        const currentKeys = await this.vatsimTraffic.toCollection()
            .primaryKeys();
        const newKeys = newData.map(item => item.cid);
        const keysToRemove = currentKeys.filter(key => !newKeys.includes(Number(key)));

        // Append aircraft data to VatsimFlight to include aircraft name and iata code
        const updatedData = newData.map(flight => {
            if (flight.flight_plan) {  //some traffic may not have flight plan
                const aircraft = aircraftData.find(mapping => mapping.icao === flight.flight_plan.aircraft_short);
                let updatedFlightPlan = { ...flight.flight_plan };

                if (aircraft) {
                    updatedFlightPlan = {
                        ...flight.flight_plan,
                        aircraft_name: aircraft.name,
                        aircraft_iata: aircraft.iata
                    };
                }

                return {
                    ...flight,
                    flight_plan: updatedFlightPlan
                };
            } else {
                return flight;
            }
        });

        await this.transaction("rw", this.vatsimTraffic, async () => {
            await this.vatsimTraffic.bulkPut(updatedData);
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