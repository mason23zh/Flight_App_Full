import { IconLayer } from "@deck.gl/layers/typed";
import generateControllerMarkerIcon from "../mapbox_Layer/util/generateControllerMarkerIcon";
import { Services } from "../mapbox_Layer/util/generateControllerMarkerIcon";
import { VatsimControllers } from "../../../types";
import { useDispatch } from "react-redux";

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
    server: Services,
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

const facilities = [
    {
        "id": 0,
        "short": "OBS",
        "long": "Observer"
    },
    {
        "id": 1,
        "short": "FSS",
        "long": "Flight Service Station"
    },
    {
        "id": 2,
        "short": "DEL",
        "long": "Clearance Delivery"
    },
    {
        "id": 3,
        "short": "GND",
        "long": "Ground"
    },
    {
        "id": 4,
        "short": "TWR",
        "long": "Tower"
    },
    {
        "id": 5,
        "short": "APP",
        "long": "Approach/Departure"
    },
    {
        "id": 6,
        "short": "CTR",
        "long": "Enroute"
    }
];

const controllerIconLayer = (
    controllerData: VatsimControllers,
    onHoverCallback: (airportService: AirportService) => void,
    visible: boolean,
) => {
    const dispatch = useDispatch();
    if (!controllerData || !controllerData?.other || !visible) return null;

    console.log("Controller icon layer run.");

    function combineAirportServices(controllers, atis, facilities): Array<AirportService> {
        console.log("combine airport service run.");
        const facilityMap = facilities.reduce((map, f) => {
            map[f.id] = f.short;
            return map;
        }, {});

        const combinedData = {};

        // Helper function to add service data to the combinedData object
        function addServiceData(airportCode, serviceType, data) {
            if (!combinedData[airportCode]) {
                combinedData[airportCode] = {
                    airportName: data.airport.name,
                    icao: airportCode,
                    coordinates: data.coordinates,
                    services: []
                };
            }

            combinedData[airportCode].services.push({
                ...data,
                serviceType,
                //coordinates: undefined // Remove coordinates from individual service
            });
        }

        // Process controllers array
        controllers.forEach(controller => {
            const airportCode = controller.airport.icao;
            const serviceType = facilityMap[controller.facility]; // Use facility id to get service type
            addServiceData(airportCode, serviceType, controller);
        });

        // Process atis array
        atis.forEach(atisData => {
            const airportCode = atisData.airport.icao;
            const serviceType = "ATIS"; // ATIS is a special case
            addServiceData(airportCode, serviceType, atisData);
        });

        // Convert combinedData to an array of objects
        return Object.values(combinedData);
    }

    const airportService = combineAirportServices(controllerData.other.controllers, controllerData.other.atis, facilities);

    const iconData = airportService.map((service: AirportService) => {
        const coordinates = [
            Number(service.coordinates[0]),
            Number(service.coordinates[1]),
        ];

        const serviceTypes = [...new Set(service.services.map((s) => s.serviceType))];

        //TODO: Add cache to avoid generate new marker icon
        return {
            position: coordinates,
            iconUrl: generateControllerMarkerIcon(service.icao, serviceTypes),
            serviceInfo: service
        };
    });


    return new IconLayer({
        id: "controller-icon-layer",
        data: iconData,
        pickable: true,
        getPosition: d => d.position,
        getIcon: d => ({
            url: d.iconUrl,
            width: 130,
            height: 80,
            anchorY: 60,
            anchorX: 50,
        }),
        sizeScale: 1,
        getSize: () => 29,
        // onHover: d => onHoverCallback(d.serviceInfo),
        onHover: ({
            object,
        }) => {
            if (object) {
                onHoverCallback(object.serviceInfo);
            } else {
                onHoverCallback(null);
            }
        },
        // getColor: () => [0, 0, 0, 255],
        parameters: { depthTest: false }
    });
};

export default controllerIconLayer;