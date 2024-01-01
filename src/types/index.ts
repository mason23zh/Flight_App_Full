interface Barometer {
    hg: string,
    hpa: string,
    kpa: string,
    mb: string
}

interface Cloud {
    base_feet_agl: number,
    base_meters_agl: number,
    code: string,
    density: string,
    feet: number,
    name: string
}

interface Dewpoint {
    celsius: number,
    fahrenheit: string
}

interface Elevation {
    feet: number,
    meters: number
}

interface Humidity {
    percent: number;
}

interface Station {
    location: {
        city: string,
        continent: string,
        country: string,
        geometry: {
            coordinates: number[],
            type: string
        },
        name: string,
        region: string
    };
}

interface Temperature {
    celsius: number,
    fahrenheit: string
}

interface Visibility {
    miles_float: number,
    meters_float: number
}

interface Wind {
    degrees: number,
    speed_kts: number,
    speed_kph: number,
    speed_mps: number,
    speed_mph: number,
    gust_kph: number,
    gust_kts: number,
    gust_mph: number,
    gust_mps: number
}

interface Weather {
    barometer: Barometer,
    clouds: [Cloud],
    dewpoint: Dewpoint,
    elevation: Elevation,
    humidity: Humidity,
    icao: string,
    raw_text: string,
    station: Station,
    temperature: Temperature,
    visibility: Visibility,
    wind: Wind
}

interface Airport {
    icao: string,
    _id: string
}

interface Organisers {
    division: string,
    organised_by_vatsim: boolean,
    region: string
}

interface Event {
    airports: [Airport],
    banner: string,
    description: string,
    end_time: string,
    id: number,
    link: string,
    name: string,
    organisers: [Organisers],
    short_description: string,
    start_time: string,
    type: string
}


export type { Weather, Event };
