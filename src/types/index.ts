import type GeoJson from "geojson";

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

interface VatsimFlightPlan {
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
    flight_plan: VatsimFlightPlan
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

interface Runway {
    gsAngle: number,
    ilsFreq: number,
    ilsHdg: number,
    runwayHdg: number,
    runwayLength: number,
    runwayLocation: {
        type: string,
        coordinates: number[]
    },
    runwayStatus: number,
    runwayWidth: number,
    runway_id: string,
    runway_ils_avl: number,
    thresholdElevation: number,
    thresholdOverflyAlt: number
}

interface DbAirportStation {
    city: string,
    continent: string,
    country: {
        country_code: string,
        country_name: string
    },
    geometry: {
        type: string,
        coordinates: number[]
    },
    name: string,
    region: {
        region_code: string,
        local_code: string,
        region_name: string
    }

}

interface DbAirport {
    ICAO: string,
    additional: {
        type: string,
        home_link: string,
        wikipedia_link: string,
    },
    elevation: number,
    iata: string,
    runways: Array<Runway>,
    station: DbAirportStation,
    transitionAltitude: number,
    visited: number
}

interface AirportResponse {
    result: number,
    data: Array<DbAirport>
}

interface Fir {
    fir: string,
    firInfo: {
        icao: string,
        name: string,
        prefix: string,
        fir: string
    },
    name: string,
    facility: number,
    callsign: string,
    frequency: string,
    visual_range: number,
    last_updated: string,
    logon_time: string
}

interface Controller {
    cid: number,
    name: string,
    callsign: string,
    frequency: string,
    facility: number,
    rating: number,
    server: string,
    visual_range: number,
    text_atis: string[] | string | null,
    last_updated: string,
    logon_time: string,
    airport: {
        name: string,
        icao: string
    },
    coordinates: string[]
}

interface Atis {
    cid: number,
    name: string,
    callsign: string,
    frequency: string,
    facility: number,
    rating: number,
    server: string,
    visual_range: number,
    atis_code: string,
    text_atis: string[],
    last_updated: string,
    logon_time: string,
    airport: {
        name: string,
        icao: string
    },
    coordinates: string[]
}

interface Fss {
    cid: number,
    name: string,
    frequency: string,
    callsign: string,
    facility: number,
    rating: number,
    server: string,
    visual_range: number,
    text_atis: string[],
    last_updated: string,
    logon_time: string,
    firInfo: {}
}


interface VatsimControllers {
    fir: Array<Fir>,
    other: {
        controllers: Array<Controller>,
        atis: Array<Atis>
    },
    fss: Array<Fss>
    tracon: Array<Controller>
}

interface MultiPolygonGeometry {
    type: "MultiPolygon",
    coordinates: [[number[]]]
}

interface VatsimGeoJsonFirBoundariesProperties {
    id: string,
    oceanic: string,
    label_lon: string,
    label_lat: string,
}

interface VatsimGeoJsonFeature {
    type: "Feature",
    properties: VatsimGeoJsonFirBoundariesProperties,
    geometry: MultiPolygonGeometry
}

interface VatsimFirBoundaries {
    type: string,
    name: string,
    crs: {
        type: string,
        properties: {
            name: string
        }
    },
    features: Array<VatsimGeoJsonFeature>
}

interface VatsimFirs {
    [key: string]: {
        icao: string;
        name: string;
        prefix: string;
        fir: string;
    };
}

interface VatsimFss {
    [key: string]: {
        prefix: string,
        name: string,
        firs: Array<string>
    };
}

interface MatchedFirsController {
    callsign: string,
    frequency: string,
    logon_time: string,
    name: string
}

interface MatchedFirs {
    [key: string]: {
        firKey: string,
        controllers: Array<MatchedFirsController>,
        firInfo: {
            fir: string,
            icao: string,
            name: string,
            prefix: string
        }
    };
}

interface VatsimMatchedFirBoundariesGeoJson {
    type: "FeatureCollection",
    features: Array<VatsimGeoJsonFeature>
}

interface Service {
    airport: { name: string, icao: string },
    callsign: string,
    cid: string,
    coordinates: string[],
    facility: number,
    frequency: string,
    last_updated: string,
    logon_time: string,
    name: string,
    rating: number,
    server: string,
    serviceType: string,
    text_atis: string[],
    visual_range: number,
    atis_code?: string,
}


interface AirportService {
    airportName: string,
    icao: string,
    coordinates: string[],
    services: Array<Service>
}

type MapStyles = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE";

interface VatsimMapVisibleState {
    allAtcLayerVisible: boolean;
    controllerLayerVisible: boolean;
    controllerMarkerVisible: boolean;
    traconLabelVisible: boolean;
    firLabelVisible: boolean;
    underlineFirBoundaries: boolean;
    mapRoadVisible: boolean;
    trackLayerVisible: boolean;
    trafficLayerVisible: boolean;
    mapLabelVisible: boolean;
    airportLabelVisible: boolean;
    satelliteLayerVisible: boolean;
    weatherRasterVisible: boolean;
    mapStyleButtonToggle: boolean;
    mapFilterButtonToggle: boolean;
    terrainEnable: boolean;
    dayNightTerminator: boolean;
    mapStyles: MapStyles;
}


export type {
    VatsimMapVisibleState,
    Weather,
    Event,
    VatsimFlight,
    VatsimFlightPlan,
    VatsimTrackTraffic,
    DbAirport,
    VatsimControllers,
    Controller,
    VatsimGeoJsonFeature,
    VatsimFirs,
    VatsimFss,
    VatsimFirBoundaries,
    VatsimMatchedFirBoundariesGeoJson,
    AirportService,
    AirportResponse,
    MatchedFirs
};
