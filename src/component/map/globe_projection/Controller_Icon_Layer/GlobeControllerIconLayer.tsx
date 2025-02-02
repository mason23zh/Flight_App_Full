import React, { useEffect, useRef, useState } from "react";
import { generateControllerMarkerIconWithIcao } from "../../mapbox_Layer/util/generateControllerMarkerIcon";
import { Layer, Source, useMap } from "react-map-gl";
import { AirportService, VatsimControllers } from "../../../../types";
import _ from "lodash";
import { GeoJSONSource } from "react-map-gl";

interface AirportServiceWithTypeArray extends AirportService {
    serviceTypeArray: string[];
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

interface Props {
    controllerData: VatsimControllers;
}

const GlobeControllerIconLayer = ({
    controllerData,
}: Props) => {
    const [controllerCache, setControllerCache] = useState<Array<AirportService>>([]);
    const loadedIconsRef = useRef(new Set<string>());

    const { current: mapRef } = useMap();
    const imagePrefix = "controller-icon-";

    const diffControllers = (newData: Array<AirportService>, oldData: Array<AirportService>) => {
        const createKey = (service: AirportService) => service.icao;

        // Convert to maps for quick comparison, keeping the original structure
        const toKeyedMap = (data: Array<AirportService>): Map<string, AirportServiceWithTypeArray> =>
            new Map(
                data.map(service => [
                    createKey(service),
                    {
                        ...service,
                        serviceTypeArray: Array.from(
                            new Set(service.services.map(svc => svc.serviceType))
                        )
                            .sort(), // Sort serviceTypes for comparison and remove duplicate
                    },
                ])
            );

        const newMap = toKeyedMap(newData);
        const oldMap = toKeyedMap(oldData);

        const added: Array<AirportServiceWithTypeArray> = [];
        const updated: Array<AirportServiceWithTypeArray> = [];
        const removed: Array<AirportServiceWithTypeArray> = [];

        for (const [key, newService] of newMap) {
            if (!oldMap.has(key)) {
                // Added service
                added.push(newService);
            } else {
                const oldService = oldMap.get(key);
                // console.log("new service:", newService);
                // console.log("old service:", oldService);
                if (!_.isEqual(newService.serviceTypeArray, oldService?.serviceTypeArray)) {
                    // Updated service
                    updated.push(newService);
                }
            }
        }

        for (const [key, oldService] of oldMap) {
            if (!newMap.has(key)) {
                // Removed service
                removed.push(oldService);
            }
        }

        // Restore the original `AirportService` structure in the return
        const restoreOriginalServices = (
            flatServices: Array<AirportServiceWithTypeArray>,
            sourceMap: Map<string, AirportService>
        ): Array<AirportServiceWithTypeArray> =>
            flatServices.map(flatService => {
                const originalService = sourceMap.get(flatService.icao)!;
                return {
                    ...originalService,
                    services: originalService.services, // restore original services
                    serviceTypeArray: flatService.serviceTypeArray, // with new serviceTypeArray to be used to draw icao
                };
            });

        return {
            added: restoreOriginalServices(added, newMap),
            updated: restoreOriginalServices(updated, newMap),
            removed: restoreOriginalServices(removed, oldMap),
        };
    };

    const combineAirportServices = (controllers, atis, facilities): Array<AirportService> => {
        const facilityMap = facilities.reduce((map, f) => {
            map[f.id] = f.short;
            return map;
        }, {});

        const combinedData = {};

        function addServiceData(airportCode, serviceType, data) {
            if (!combinedData[airportCode]) {
                combinedData[airportCode] = {
                    airportName: data.airport.name,
                    icao: airportCode,
                    coordinates: data.coordinates,
                    services: [],
                };
            }

            combinedData[airportCode].services.push({
                ...data,
                serviceType,
            });
        }

        controllers.forEach((controller) => {
            const airportCode = controller.airport.icao;
            const serviceType = facilityMap[controller.facility];
            addServiceData(airportCode, serviceType, controller);
        });

        atis.forEach((atisData) => {
            const airportCode = atisData.airport.icao;
            const serviceType = "ATIS";
            addServiceData(airportCode, serviceType, atisData);
        });

        return Object.values(combinedData);
    };


    useEffect(() => {
        if (!mapRef?.getMap || !controllerData) return;
        const map = mapRef.getMap();

        // combine controller and ATIS data
        const combinedData = combineAirportServices(
            controllerData?.other.controllers || [],
            controllerData?.other.atis || [],
            facilities || []
        );


        // run diffCtl before updating the cache
        const {
            added,
            updated,
            removed
        } = diffControllers(combinedData, controllerCache);

        // console.log("Diff controller added:", added.length);
        // console.log("Diff controller updated:", updated.length);
        // console.log("Diff controller removed:", removed.length);


        // add or update icons
        [...added, ...updated].forEach((
            airport
        ) => {
            const icao = airport.icao;
            const iconId = `${imagePrefix}${icao}`;
            const iconUrl = generateControllerMarkerIconWithIcao(icao, airport.serviceTypeArray);

            if (!map.hasImage(iconId) && !loadedIconsRef.current.has(iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(iconId)) {
                        // console.log("no image:", iconId);
                        map.addImage(iconId, image, { sdf: false });
                        loadedIconsRef.current.add(iconId);
                    }
                };
                image.onerror = () => {
                    console.error("Error loading image ");
                };
                image.src = iconUrl;
            } else {
                // console.log("image exists:", iconId);
                // Update existing icons
                const image = new Image();
                image.onload = () => map.updateImage(iconId, image);
                image.src = iconUrl;
            }
        });

        removed.forEach((airport) => {
            const iconId = `${imagePrefix}${airport.icao}`;
            if (map.hasImage(iconId)) {
                // console.log("remove image:", iconId);
                map.removeImage(iconId);
                loadedIconsRef.current.delete(iconId);
            }
        });

        // Update cache
        setControllerCache(combinedData);

        const newGeoJson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: combinedData.map((service) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        Number(service.coordinates[0]),
                        Number(service.coordinates[1])
                    ],
                },
                properties: {
                    ...service,
                    services: JSON.stringify(service.services)
                    // services: service.services,
                },
            })),
        };

        const source: GeoJSONSource = map.getSource("controller-icon-layer-source-globe") as GeoJSONSource;
        if (source) {
            source.setData(newGeoJson);
        }

        // Cleanup
        return () => {
            removed.forEach(({ icao }) => {
                const iconId = `${imagePrefix}${icao}`;
                if (map.hasImage(iconId)) {
                    // console.log("Cleaning up removed image:", iconId);
                    map.removeImage(iconId);
                }
            });
        };
    }, [controllerData, mapRef, facilities]);


    return (
        <Source
            id="controller-icon-layer-source-globe"
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                id="controller-icon-globe-layer"
                // beforeId="flight-path-layer-globe"
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "icao"]],
                    "icon-size": 0.5,
                    "icon-allow-overlap": true,
                }}
            />
        </Source>
    );
};

export default GlobeControllerIconLayer;

