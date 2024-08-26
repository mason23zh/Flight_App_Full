import Dexie, { Table } from "dexie";
import aircraftData from "../assets/aircraft_data/aircraft.json";
import {
    FirFeature,
    FirFeatureCollection,
    LocalDbAirport,
    MergedFirMatching,
    MergedFssMatching,
    VatsimFlight
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
                    fir: `&uniqueId,
                        icao,
                        callsignPrefix,
                        firBoundary`,
                    fss: `&fssCallsign, 
                          fssName`,
                    tracon: `&id,
                            *prefix`,
                    firBoundaries: "&[properties.id+properties.oceanic]"
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

    async loadFir(newData: MergedFirMatching[]) {
        const validFirData = newData.filter(fir => fir.uniqueId);
        await this.fir.clear();
        await this.fir.bulkPut(validFirData);
    }

    async loadFss(newData: MergedFssMatching[]) {
        const validFssData = newData.filter(fss => fss.fssCallsign);
        await this.fss.clear();
        await this.fss.bulkPut(validFssData);
    }

    async loadTracon(newData: VatsimTraconMapping[]) {
        const validTraconData = newData.filter(tracon => tracon.id);
        await this.tracon.clear();
        await this.tracon.bulkPut(validTraconData);
    }

    async loadFirBoundaries(newData: FirFeatureCollection) {
        const features = newData.features.filter((feature) => {
            console.log("Features:", feature);
            if (feature.properties.id && feature.properties.oceanic) {
                // const id = feature.properties.id + Math.random();
                return {
                    ...feature
                };
            }
        });

        try {
            await this.firBoundaries.clear();
            await this.firBoundaries.bulkPut(features);
        } catch (e) {
            console.log("failed to import, ", e);
        }
    }
}


const db = new VatsimLocalDB();

export { db };