import { VatsimControllers } from "../types";
import React, { useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";

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

const colClassMap = {
    0: "grid grid-cols-0 text-[8px] w-full",
    1: "grid grid-cols-1 text-[8px] w-full",
    2: "grid grid-cols-2 text-[8px] w-full",
    3: "grid grid-cols-3 text-[8px] w-full",
    4: "grid grid-cols-4 text-[8px] w-full"
};


const useRenderControllerMarkers = (controllerInfo: VatsimControllers) => {
    const [data, setData] = useState<Array<AirportService>>([]);
    const [hoverInfo, handleMouse] = useDelayHoverLabel();

    useEffect(() => {
        function combineAirportServices(controllers, atis, facilities): Array<AirportService> {
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

        if (controllerInfo) {
            const temp = combineAirportServices(controllerInfo.other.controllers, controllerInfo.other.atis, facilities);
            setData(temp);
        }

    }, [controllerInfo]);

    const generateServiceLabels = (services: Array<Service>) => {
        let delIcon = null;
        let gndIcon = null;
        let twrIcon = null;
        let atisIcon = null;
        if (services.length > 0) {
            services.forEach((s) => {
                if (s.facility === 5 || s.facility === 6) return;
                if (s.atis_code || s.callsign.includes("ATIS")) {
                    atisIcon = (
                        <div className="bg-yellow-500 text-center">
                            <div className="px-0.5 py-0">A</div>
                        </div>
                    );
                }
                if (!s.atis_code && s.facility === 2) {
                    delIcon = <div className="bg-blue-500 text-center ">
                        <div className="px-0.5 py-0">D</div>
                    </div>;
                }
                if (!s.atis_code && s.facility === 3) {
                    gndIcon = <div
                        className="bg-green-500 text-center"
                    >
                        <div className="px-0.5 py-0">G</div>
                    </div>;
                }

                if (!s.atis_code && s.facility === 4) {
                    twrIcon = <div className="bg-red-500 text-center">
                        <div className="px-0.5 py-0">T</div>
                    </div>;
                }
            });
        }
        const iconNumbers = [atisIcon, delIcon, gndIcon, twrIcon].filter(Boolean);
        const numIcons = iconNumbers.length;

        const iconClass = colClassMap[numIcons] || colClassMap[0];

        return (
            <div className={iconClass}>
                {atisIcon}
                {delIcon}
                {gndIcon}
                {twrIcon}
            </div>
        );
    };


    const renderMarkers = () => {
        return data.map((a) => {
            const serviceIcons = generateServiceLabels(a.services);
            const icao = <div className="font-semibold opacity-80 text-gray-50">
                {a.icao}
            </div>;

            return (
                <Marker
                    style={{ zIndex: 10 }}
                    longitude={Number(a.coordinates[0])}
                    latitude={Number(a.coordinates[1])}
                    scale={0.5}
                    key={a.icao}
                    anchor="bottom">
                    <div
                        onMouseEnter={() => handleMouse(a, true, 150, 10)}
                        onMouseLeave={() => handleMouse(null, false, 150, 10)}
                        className="grid grid-cols-1 text-center text-[9px] text-gray-50 bg-gray-500 px-0.5"
                    >
                        {icao}
                        {serviceIcons}
                    </div>
                </Marker>
            );
        });
    };


    // const renderedMarkers = renderMarkers();
    const renderedMarkers = useMemo(() => renderMarkers(), [data]);


    return {
        renderedMarkers,
        hoverInfo
    };
};

export default useRenderControllerMarkers;