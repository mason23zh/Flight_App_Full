export {};

declare global {
    interface Airport {
        ICAO: string
        station: {
            name: string
            region: {
                region_name: string
            }
            country: {
                country_code: string
                country_name: string
            }
            geometry: {
                coordinates: [number, number]
            }
        }
        iata: string
        elevation: number
        transitionAltitude: number
    }
}
