import { GroupedFlight, LocalDbAirport, VatsimFlight } from "../../../../types";
import { db } from "../../../../database/db";

export const searchAirports = async (query: string): Promise<LocalDbAirport[]> => {
    if (!query) return [];
    try {
        return await db.airports
            .filter(airport =>
                airport.name.toLowerCase()
                    .includes(query.toLowerCase()) ||
                        (airport.iata_code && airport.iata_code.toLowerCase()
                            .includes(query.toLowerCase())) ||
                        (airport.municipality && airport.municipality.toLowerCase()
                            .includes(query.toLowerCase())) ||
                        (airport.gps_code && airport.gps_code.toLowerCase()
                            .includes(query.toLowerCase()))
            )
            .toArray();
    } catch (e) {
        console.error("Error Searching airports.");
        return [];
    }
};

export const searchAirportByIdent = async (query: string): Promise<LocalDbAirport[]> => {
    if (!query || query.length === 0) return [];
    const lowerCaseQuery = query.toLowerCase();
    try {
        return await db.airports
            .filter(airport =>
                airport.ident.toLowerCase()
                    .includes(lowerCaseQuery))
            .toArray();
    } catch (e) {
        return [];
    }
};


export const searchVatsimTraffic = async (query: string): Promise<VatsimFlight[]> => {
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    try {
        return await db.vatsimTraffic
            .filter(traffic =>
                traffic.callsign.toLowerCase()
                    .includes(lowerCaseQuery) ||
                        traffic.cid.toString()
                            .includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.aircraft?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.aircraft_faa?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.aircraft_short?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.arrival?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.departure?.toLowerCase() || "").includes(lowerCaseQuery)
            )
            .toArray();
    } catch (e) {
        console.error("Error Searching Vatsim traffic.");
        return [];
    }
};

const groupByAircraftType = (flights: VatsimFlight[]): GroupedFlight[] => {
    const groupedFlights: { [key: string]: VatsimFlight[] } = {};

    flights.forEach(flight => {
        const aircraftType = flight.flight_plan?.aircraft ||
                flight.flight_plan?.aircraft_faa ||
                flight.flight_plan?.aircraft_short ||
                "Unknown";

        if (!groupedFlights[aircraftType]) {
            groupedFlights[aircraftType] = [];
        }

        groupedFlights[aircraftType].push(flight);
    });

    return Object.keys(groupedFlights)
        .map(aircraftType => ({
            aircraftType,
            flights: groupedFlights[aircraftType],
        }));
};

export const searchByAircraftType = async (query: string): Promise<GroupedFlight[]> => {
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();

    try {
        const results = await db.vatsimTraffic
            .filter(traffic =>
                (traffic?.flight_plan?.aircraft?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.aircraft_faa?.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.aircraft_short?.toLowerCase() || "").includes(lowerCaseQuery)
            )
            .toArray();

        return groupByAircraftType(results);
    } catch (e) {
        return [];
    }
};

export const searchFlightsByAirports = async (query: string): Promise<VatsimFlight[]> => {
    if (!query) return [];

    const lowerCaseQuery = query.toLowerCase();
    try {
        return await db.vatsimTraffic
            .filter(traffic =>
                (traffic?.flight_plan?.departure.toLowerCase() || "").includes(lowerCaseQuery) ||
                        (traffic?.flight_plan?.arrival.toLowerCase() || "").includes(lowerCaseQuery)
            )
            .toArray();
    } catch (e) {
        return [];
    }
};

