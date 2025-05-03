import React, { useCallback, useEffect, useRef } from "react";
import { generateControllerMarkerIconWithIcao } from "../../mapbox_Layer/util/generateControllerMarkerIcon";
import { Layer, Source, useMap } from "react-map-gl";
import { AirportService, Atis, Controller, VatsimControllers } from "../../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { GLOBE_CONTROLLER_ICON_LAYER_ID, GLOBE_CONTROLLER_ICON_SOURCE_ID } from "../layerSourceName";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import useGlobeLayerVisibility from "../../../../hooks/useGlobeLayerVisibility";

interface Facilities {
    id: number;
    short: string;
}

const facilities: Facilities[] = [
    {
        id: 0,
        short: "OBS",
    },
    {
        id: 1,
        short: "FSS",
    },
    {
        id: 2,
        short: "DEL",
    },
    {
        id: 3,
        short: "GND",
    },
    {
        id: 4,
        short: "TWR",
    },
    {
        id: 5,
        short: "APP",
    },
    {
        id: 6,
        short: "CTR",
    },
];

interface Props {
    controllerData: VatsimControllers;
}

const GlobeControllerIconLayer = ({ controllerData }: Props) => {
    const {
        mapStyles,
        allAtcLayerVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);
    const controllerCacheRef = useRef<AirportService[]>([]);
    const loadedIconsRef = useRef(new Set<string>());
    const { current: mapRef } = useMap();
    const imagePrefix = "controller-icon-";

    const combineAirportServices = (
        controllers: Controller[],
        atis: Atis[],
        facilities: Facilities[],
    ): Array<AirportService> => {
        const facilityMap = facilities.reduce((map, f) => {
            map[f.id] = f.short;
            return map;
        }, {});

        const combinedData = {};

        function addServiceData(airportCode: string, serviceType: string, data: Controller) {
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

    const diffControllers = useCallback((newData: AirportService[], oldData: AirportService[]) => {
        const toMap = (data: AirportService[]) => new Map(data.map((service) => [service.icao, service]));
        const newMap = toMap(newData);
        const oldMap = toMap(oldData);

        const added = [...newMap.entries()].filter(([key]) => !oldMap.has(key))
            .map(([, service]) => service);
        const removed = [...oldMap.entries()].filter(([key]) => !newMap.has(key))
            .map(([, service]) => service);
        const updated = [...newMap.entries()]
            .filter(
                ([key, service]) =>
                    oldMap.has(key) && JSON.stringify(service.services) !== JSON.stringify(oldMap.get(key)?.services),
            )
            .map(([, service]) => service);

        return {
            added,
            updated,
            removed,
        };
    }, []);

    const loadIcons = useCallback((map: mapboxgl.Map, services: AirportService[]) => {
        services.forEach(({
            icao,
            services
        }) => {
            const iconId = `${imagePrefix}${icao}`;
            if (!map.hasImage(iconId) && !loadedIconsRef.current.has(iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(iconId)) {
                        map.addImage(iconId, image, { sdf: false });
                        loadedIconsRef.current.add(iconId);
                    }
                };
                const uniqueServiceTypes = Array.from(
                    new Set(services.map((s) => s.serviceType))
                );

                image.src = generateControllerMarkerIconWithIcao(icao, uniqueServiceTypes);
            }
        });
    }, []);

    const removeIcons = useCallback((map: mapboxgl.Map, services: AirportService[]) => {
        services.forEach(({ icao }) => {
            const iconId = `${imagePrefix}${icao}`;
            if (map.hasImage(iconId)) {
                map.removeImage(iconId);
                loadedIconsRef.current.delete(iconId);
            }
        });
    }, []);

    const updateGeoJson = useCallback((map: mapboxgl.Map, services: AirportService[]) => {
        const geoJson: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: services.map(({
                icao,
                coordinates,
                services
            }) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [Number(coordinates[0]), Number(coordinates[1])],
                },
                properties: {
                    icao,
                    coordinates: JSON.stringify(coordinates), // Add coordinates to properties for hover
                    services: JSON.stringify(services),
                },
            })),
        };

        let source = map.getSource(GLOBE_CONTROLLER_ICON_SOURCE_ID) as GeoJSONSource;

        if (!source) {
            map.addSource(GLOBE_CONTROLLER_ICON_SOURCE_ID, {
                type: "geojson",
                data: geoJson,
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

        source?.setData(geoJson);
    }, []);

    useEffect(() => {
        if (!mapRef?.getMap || !controllerData) return;
        const map = mapRef.getMap();

        const combinedData = combineAirportServices(
            controllerData?.other.controllers || [],
            controllerData?.other.atis || [],
            facilities,
        );

        const {
            added,
            updated,
            removed
        } = diffControllers(combinedData, controllerCacheRef.current);
        loadIcons(map, [...added, ...updated]);
        removeIcons(map, removed);
        updateGeoJson(map, combinedData);

        controllerCacheRef.current = combinedData;
    }, [controllerData, combineAirportServices, diffControllers, loadIcons, removeIcons, updateGeoJson]);

    useEffect(() => {
        if (!mapRef?.getMap) return;
        const map = mapRef.getMap();

        const restoreOnStyleChange = () => {
            loadedIconsRef.current.clear();
            controllerCacheRef.current = [];

            const combinedData = combineAirportServices(
                controllerData?.other.controllers || [],
                controllerData?.other.atis || [],
                facilities,
            );

            const {
                added,
                removed
            } = diffControllers(combinedData, []);
            loadIcons(map, added);
            removeIcons(map, removed);
            updateGeoJson(map, added);
        };

        map.on("style.load", restoreOnStyleChange);
        return () => {
            map.off("style.load", restoreOnStyleChange);
        };
    }, [mapRef, loadIcons, updateGeoJson, mapStyles]);

    // useGlobeLayerVisibility(mapRef, GLOBE_CONTROLLER_ICON_LAYER_ID, allAtcLayerVisible);

    return (
        <Source
            id={GLOBE_CONTROLLER_ICON_SOURCE_ID}
            type="geojson"
            data={{
                type: "FeatureCollection",
                features: [],
            }}
        >
            <Layer
                id={GLOBE_CONTROLLER_ICON_LAYER_ID}
                type="symbol"
                layout={{
                    "icon-image": ["concat", imagePrefix, ["get", "icao"]],
                    "icon-size": 0.5,
                    "icon-allow-overlap": true,
                    visibility: allAtcLayerVisible ? "visible" : "none",
                }}
            />
        </Source>
    );
};

export default GlobeControllerIconLayer;
