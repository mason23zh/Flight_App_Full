import React, { useEffect, useMemo, useRef, useState } from "react";
import { generateControllerMarkerIconWithIcao } from "../../mapbox_Layer/util/generateControllerMarkerIcon";
import { Layer, Source, useMap } from "react-map-gl";
import { AirportService, VatsimControllers } from "../../../../types";
import { GeoJSON } from "geojson";
import _ from "lodash";

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

        console.log("old data:", oldData);
        console.log("new data:", newData);
        // Convert to maps for quick comparison, keeping the original structure
        const toKeyedMap = (data: Array<AirportService>) =>
            new Map(
                data.map(service => [
                    createKey(service),
                    {
                        ...service,
                        services: service.services.map(svc => svc.serviceType)
                            .sort(), // Sort serviceTypes for comparison
                    },
                ])
            );

        const newMap = toKeyedMap(newData);
        const oldMap = toKeyedMap(oldData);

        const added: Array<AirportService> = [];
        const updated: Array<AirportService> = [];
        const removed: Array<AirportService> = [];

        for (const [key, newService] of newMap) {
            if (!oldMap.has(key)) {
                // Added service
                added.push(newService);
            } else {
                const oldService = oldMap.get(key);
                console.log("new service:", newService);
                console.log("old service:", oldService);
                // console.log("services update:", newService.services, oldService?.services);
                if (!_.isEqual(newService.services, oldService?.services)) {
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
            flatServices: Array<AirportService>,
            sourceMap: Map<string, AirportService>
        ): Array<AirportService> =>
            flatServices.map(flatService => ({
                ...sourceMap.get(flatService.icao)!,
                services: sourceMap.get(flatService.icao)!.services,
            }));

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

        console.log("Diff controller added:", added.length);
        console.log("Diff controller updated:", updated.length);
        console.log("Diff controller removed:", removed.length);

        // controllerCache.forEach((airport) => {
        //     const iconId = `${imagePrefix}${airport.icao}`;
        //     if (!map.hasImage(iconId)) {
        //         console.log(`Re-adding missing icon: ${iconId}`);
        //         const iconUrl = generateControllerMarkerIconWithIcao(airport.icao, airport.services);
        //         const image = new Image();
        //         image.onload = () => {
        //             if (!map.hasImage(iconId)) {
        //                 map.addImage(iconId, image, { sdf: false });
        //                 loadedIconsRef.current.add(iconId);  // Ensure persistence
        //             }
        //         };
        //         image.src = iconUrl;
        //     }
        // });

        // add or update icons
        [...added, ...updated].forEach((
            airport
        ) => {
            const icao = airport.icao;
            const iconId = `${imagePrefix}${icao}`;
            const iconUrl = generateControllerMarkerIconWithIcao(icao, airport.services);

            if (!map.hasImage(iconId) && !loadedIconsRef.current.has(iconId)) {
                const image = new Image();
                image.onload = () => {
                    if (!map.hasImage(iconId)) {
                        console.log("no image:", iconId);
                        map.addImage(iconId, image, { sdf: false });
                        loadedIconsRef.current.add(iconId);
                    }
                };
                image.onerror = () => {
                    console.log("Error loading image ");
                };
                image.src = iconUrl;
            } else {
                console.log("image exists:", iconId);
                // Update existing icons
                const image = new Image();
                image.onload = () => map.updateImage(iconId, image);
                image.src = iconUrl;
            }
        });

        removed.forEach((airport) => {
            const iconId = `${imagePrefix}${airport.icao}`;
            if (map.hasImage(iconId)) {
                console.log("remove image:", iconId);
                map.removeImage(iconId);
                loadedIconsRef.current.delete(iconId);
            }
        });

        // Update cache
        setControllerCache(combinedData);

        const newGeoJson = {
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
                },
            })),
        };

        const source = map.getSource("controller-icon-layer-source-globe");
        if (source) {
            source.setData(newGeoJson);
        }

        // Cleanup
        // return () => {
        //     try {
        //         // const currentData = cachedControllersRef.current;
        //         const currentData = controllerCache;
        //         currentData.forEach(({ icao }) => {
        //             const iconId = `${imagePrefix}${icao}`;
        //             if (map.hasImage(iconId)) {
        //                 console.log("clean up remove image:", iconId);
        //                 map.removeImage(iconId);
        //             }
        //         });
        //         // cachedControllersRef.current = []; // Clear cache
        //     } catch (e) {
        //         console.error("Error cleaning up controller icons:", e);
        //     }
        // };

    }, [controllerData, mapRef, facilities]);


    // const geoJsonData = useMemo(() => {
    //     // if (!controllerData || !facilities || cachedControllersRef.current.length === 0) return null;
    //     if (!controllerCache.length) return null;
    //
    //     return {
    //         type: "FeatureCollection",
    //         features: controllerCache.map((service) => {
    //             return {
    //                 type: "Feature",
    //                 geometry: {
    //                     type: "Point",
    //                     coordinates: [
    //                         Number(service.coordinates[0]),
    //                         Number(service.coordinates[1])
    //                     ],
    //                 },
    //                 properties: {
    //                     ...service,
    //                     // icao: service.icao,
    //                     // airportName: service.airportName,
    //                     services: JSON.stringify(service.services)
    //                 },
    //             };
    //         }),
    //     } as GeoJSON;
    // }, [controllerCache]);

    // if (!geoJsonData) return null;

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

