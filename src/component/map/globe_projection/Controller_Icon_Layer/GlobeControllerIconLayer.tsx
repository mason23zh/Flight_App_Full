import React, { useEffect, useMemo } from "react";
import { generateControllerMarkerIconWithIcao } from "../../mapbox_Layer/util/generateControllerMarkerIcon";
import { Layer, Source, useMap } from "react-map-gl";
import { AirportService, VatsimControllers } from "../../../../types";
import { GeoJSON } from "geojson";

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
    const { current: mapRef } = useMap();
    const imagePrefix = "controller-icon-";

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

        const addControllerIcons = () => {
            const combinedData = combineAirportServices(
                controllerData?.other.controllers || [],
                controllerData?.other.atis || [],
                facilities || []
            );

            combinedData.forEach((service) => {
                const {
                    icao,
                    services
                } = service;
                const serviceTypes = [...new Set(services.map((s) => s.serviceType))];
                const iconId = `${imagePrefix}${icao}`;
                const iconUrl = generateControllerMarkerIconWithIcao(icao, serviceTypes);


                if (!map.hasImage(iconId)) {
                    const image = new Image();
                    image.onload = () => {
                        if (!map.hasImage(iconId)) { // Check again before adding
                            map.addImage(iconId, image, { sdf: false });
                        }
                    };
                    image.onerror = () => {
                        console.error(`Error loading icon for ${icao}`);
                    };
                    image.src = iconUrl; // Set the Base64 data URL as the source
                }
            });
        };

        addControllerIcons();

        const onStyleData = () => {
            addControllerIcons();
        };
        map.on("styledata", onStyleData);

        return () => {
            map.off("styledata", onStyleData);
            try {
                controllerData.other.controllers.forEach(({ airport: { icao } }) => {
                    const iconId = `${imagePrefix}${icao}`;
                    if (map.hasImage(iconId)) {
                        map.removeImage(iconId);
                    }
                });
            } catch (e) {
                console.error("Error cleaning up controller icons:", e);
            }
        };
    }, [controllerData, facilities, mapRef]);

    const geoJsonData = useMemo(() => {
        if (!controllerData || !facilities) return null;

        const combinedData = combineAirportServices(
            controllerData?.other.controllers || [],
            controllerData?.other.atis || [],
            facilities
        );

        return {
            type: "FeatureCollection",
            features: combinedData.map((service) => {
                return {
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
                        // icao: service.icao,
                        // airportName: service.airportName,
                        services: JSON.stringify(service.services)
                    },
                };
            }),
        } as GeoJSON;
    }, [controllerData, facilities]);

    if (!geoJsonData) return null;

    return (
        <Source
            id="controller-icon-layer-source-globe"
            type="geojson"
            data={geoJsonData}
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

