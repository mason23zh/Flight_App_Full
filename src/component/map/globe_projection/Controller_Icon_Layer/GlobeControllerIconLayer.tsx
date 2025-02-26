import React, { useCallback, useEffect, useRef, useState } from "react";
import { generateControllerMarkerIconWithIcao } from "../../mapbox_Layer/util/generateControllerMarkerIcon";
import { Layer, Source, useMap } from "react-map-gl";
import { AirportService, VatsimControllers } from "../../../../types";
import _ from "lodash";
import { GeoJSONSource } from "react-map-gl";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GLOBE_CONTROLLER_ICON_LAYER_ID, GLOBE_CONTROLLER_ICON_SOURCE_ID } from "../layerSourceName";
import mapboxgl from "mapbox-gl";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";

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
    const {
        mapStyles,
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    // const [controllerCache, setControllerCache] = useState<Array<AirportService>>([]);
    const controllerCacheRef = useRef<Array<AirportService>>([]);
    const loadedIconsRef = useRef(new Set<string>());

    const { current: mapRef } = useMap();
    const imagePrefix = "controller-icon-";

    const diffControllers_ = useCallback((newData: Array<AirportService>, oldData: Array<AirportService>) => {
        console.log("new data:", newData.length);
        console.log("old data:", oldData.length);
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
    }, []);

    const diffControllers = (newData: Array<AirportService>, oldData: Array<AirportService>) => {
        console.log("new data:", newData.length);
        console.log("old data:", oldData.length);
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
        console.log("combine airport service run.");
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

    // refactor stars here
    const processControllers = useCallback(() => {
        console.log("process controller run.");
        if (!controllerData || !mapRef?.getMap) {
            return {
                combinedData: [],
                added: [],
                updated: [],
                removed: []
            };
        }

        // const map = mapRef.getMap();
        const combinedData = combineAirportServices(
            controllerData?.other.controllers || [],
            controllerData?.other.atis || [],
            facilities || []
        );


        let oldData = controllerCacheRef.current;
        if (controllerCacheRef.current.length === 0) {
            oldData = [];
        }

        const {
            added,
            updated,
            removed
        } = diffControllers_(combinedData, oldData);

        console.log("Diff Controllers - Added:", added.length, "Updated:", updated.length, "Removed:", removed.length);

        return {
            combinedData,
            added,
            updated,
            removed
        };
    }, [controllerData, diffControllers_, mapRef]);

    //load controller icons
    const loadIcons = useCallback((map: mapboxgl.Map, added: AirportServiceWithTypeArray[], updated: AirportServiceWithTypeArray[]) => {
        console.log("load icon run.");
        if (!added.length && !updated.length) return;

        [...added, ...updated].forEach((airport) => {
            const icao = airport.icao;
            const iconId = `${imagePrefix}${icao}`;
            const iconUrl = generateControllerMarkerIconWithIcao(icao, airport.serviceTypeArray);

            if (!map.hasImage(iconId) && !loadedIconsRef.current.has(iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(iconId)) {
                        map.addImage(iconId, image, { sdf: false });
                        loadedIconsRef.current.add(iconId);
                    }
                };
                image.src = iconUrl;
            }
        });

    }, []);

    // remove old controllers
    const removeIcons = useCallback((map: mapboxgl.Map, removed: AirportServiceWithTypeArray[]) => {
        console.log("remove icon run.");
        if (!removed.length) return;

        removed.forEach((airport) => {
            const iconId = `${imagePrefix}${airport.icao}`;
            if (map.hasImage(iconId)) {
                map.removeImage(iconId);
                loadedIconsRef.current.delete(iconId);
            }
        });
    }, []);

    //update json
    const updateGeoJson = useCallback((map: mapboxgl.Map, combinedData: AirportService[]) => {
        console.log("update geojson run.");
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
                    services: JSON.stringify(service.services),
                },
            })),
        };

        let source = map.getSource("controller-icon-layer-source-globe") as GeoJSONSource;

        if (!source) {
            console.log("Source missing after style change! Re-adding it...");
            map.addSource(GLOBE_CONTROLLER_ICON_SOURCE_ID, {
                type: "geojson",
                data: newGeoJson,
                generateId: true,
            });

            map.addLayer({
                id: GLOBE_CONTROLLER_ICON_LAYER_ID,
                type: "symbol",
                source: GLOBE_CONTROLLER_ICON_SOURCE_ID,
                layout: {
                    "icon-image": ["concat", imagePrefix, ["get", "icao"]],
                    "icon-size": 0.5,
                    "icon-allow-overlap": true,
                },
            });

            source = map.getSource(GLOBE_CONTROLLER_ICON_SOURCE_ID) as GeoJSONSource;
        }

        if (source) {
            source.setData(newGeoJson);
        }
    }, [mapRef]);


    //useEffect #1: process controllers on data change
    useEffect(() => {
        if (!controllerData || !mapRef?.getMap) return;
        const map = mapRef.getMap();

        const {
            combinedData,
            added,
            updated,
            removed
        } = processControllers();
        loadIcons(map, added, updated);
        removeIcons(map, removed);
        updateGeoJson(map, combinedData);

        // update cache after processing
        controllerCacheRef.current = combinedData;
        // setControllerCache(combinedData);
    }, [controllerData, processControllers, loadIcons, removeIcons, updateGeoJson]);

    //useEffect #2: restore icons && source is map style change
    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const handleStyleLoad = () => {
            console.log("Map style changed! Reprocessing all controllers...");
            loadedIconsRef.current.clear();
            // Clear cache and force reprocessing
            controllerCacheRef.current = [];
            // setControllerCache([]);

            // Fully reprocess controllers and restore icons
            const {
                combinedData,
                added,
                updated,
                removed
            } = processControllers();
            loadIcons(map, added, updated);
            removeIcons(map, removed);
            updateGeoJson(map, combinedData);
        };

        map.on("style.load", handleStyleLoad);
        return () => {
            map.off("style.load", handleStyleLoad);
        };
    }, [mapStyles]);


    //visibility control
    useGlobeLayerVisibility(mapRef, GLOBE_CONTROLLER_ICON_LAYER_ID, allAtcLayerVisible);
    console.log("Globe controlelr icon layer run.");
    return (
        <Source
            id={GLOBE_CONTROLLER_ICON_SOURCE_ID}
            type="geojson"
            // data={geoJsonData}
            data={{
                type: "FeatureCollection",
                features: []
            }}
        >
            <Layer
                id={GLOBE_CONTROLLER_ICON_LAYER_ID}
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

