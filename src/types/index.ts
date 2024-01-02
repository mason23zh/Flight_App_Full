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

interface VatsimFlight {
    altitude: number,
    callsign: string,
    cid: number,
    groundspeed: number,
    heading: number,
    last_updated: string,
    latitude: number,
    logon_time: string,
    longitude: number,
    military_rating: number,
    name: string,
    pilot_rating: number,
    qnh_i_hg: number,
    qnh_mb: number,
    server: string,
    transponder: string,
    flight_plan: {
        flight_rules: string,
        aircraft: string,
        aircraft_faa: string,
        aircraft_short: string
        alternate: string,
        altitude: string,
        arrival: string,
        assigned_transponder: string,
        cruise_tas: string,
        departure: string,
        deptime: string,
        enroute_time: string,
        fuel_time: string,
        remarks: string,
        revision_id: number,
        route: string
    }
}

interface TrackObj {
    latitude: number,
    longitude: number,
    altitude: number,
    groundSpeed: number,
    heading: number,
    qnhIhg: number,
    compensation: number
}

interface VatsimTrackTraffic {
    cid: number,
    name: string,
    callsign: string,
    server: string,
    transponder: string,
    flightRules: string,
    aircraft: {
        full: string,
        faa: string,
        short: string
    },
    arrival: string,
    departure: string,
    alternate: string,
    depTime: string,
    enrouteTime: string,
    fuelTime: string,
    remarks: string,
    route: string,
    logonTime: string,
    lastUpdated: string,
    track: [TrackObj]
}


export type { Weather, Event, VatsimFlight, VatsimTrackTraffic };
