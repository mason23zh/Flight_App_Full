import { AirportService, VatsimControllers } from "../types";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";
// import generateControllerMarkerIcon from "../component/2d/mapbox_Layer/util/generateControllerMarkerIcon";
import {
    generateControllerMarkerIconWithIcao,
} from "../component/2d/mapbox_Layer/util/generateControllerMarkerIcon";

import { IconLayer } from "@deck.gl/layers/typed";
import { debounce } from "lodash";
import { setHoveredController } from "../store";

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

const useControllerIconLayer = (
    controllerData: VatsimControllers,
    visible: boolean,
) => {

    const dispatch = useDispatch();
    const debouncedHover = useCallback(
        debounce((data) => {
            dispatch(setHoveredController(data));
        }, 250),
        [dispatch]
    );
    // Clean up the debounce function when the component unmounts
    useEffect(() => {
        return () => {
            debouncedHover.cancel();
        };
    }, [debouncedHover]);


    const iconData = useMemo(() => {
        if (!controllerData) return null;
        const combineAirportServices = (controllers, atis, facilities): Array<AirportService> => {
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
        };

        const airportService = combineAirportServices(controllerData.other.controllers, controllerData.other.atis, facilities);

        const data = airportService.map((service: AirportService) => {
            const coordinates = [
                Number(service.coordinates[0]),
                Number(service.coordinates[1]),
            ];

            const serviceTypes = [...new Set(service.services.map((s) => s.serviceType))];

            //TODO: Add cache to avoid generate new marker icon
            return {
                position: coordinates,
                iconUrl: generateControllerMarkerIconWithIcao(service.icao, serviceTypes),
                serviceInfo: service
            };
        });
        return data;
    }, [controllerData]);


    return useMemo(() => {
        return new IconLayer({
            id: "controller-icon-layer",
            data: iconData,
            pickable: true,
            visible: visible,
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
                    debouncedHover(object.serviceInfo);
                } else {
                    debouncedHover(null);
                }
            },
            // getColor: () => [0, 0, 0, 255],
            parameters: { depthTest: false },
            updateTriggers: {
                getIcon: iconData?.map(d => `${d.serviceInfo.icao}-${d.serviceInfo.services.map(s => s.serviceType)
                    .join(",")}`)
                    .join("-"),
            }
        });
    }, [controllerData, visible]);
};

export default useControllerIconLayer;