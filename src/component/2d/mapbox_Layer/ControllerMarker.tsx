import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-map-gl";
import { VatsimControllers } from "../../../types";


interface Controller {
    controllerInfo: VatsimControllers;
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


const ControllerMarker = ({ controllerInfo }: Controller) => {
    console.log("Controller Marker render");
    const [data, setData] = useState<Array<AirportService>>([]);
    const [colsNumber, setColsNumber] = useState<number>(0);

    // const [showPopup, setShowPopup] = useState<boolean>(false);
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
            //console.log(temp);
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
                if (s.atis_code || s.callsign.includes("ATIS")) {
                    atisIcon = (
                        <div className="bg-yellow-500 text-center" title="Atis">
                            <div className="px-0.5 py-0">A</div>
                        </div>
                    );
                }
                if (!s.atis_code && s.facility === 2) {
                    delIcon = <div className="bg-blue-500 text-center " title="Delivery">
                        <div className="px-0.5 py-0">D</div>
                    </div>;
                }
                if (!s.atis_code && s.facility === 3) {
                    gndIcon = <div
                        className="bg-green-500 text-center"
                        title="Ground"
                    >
                        <div className="px-0.5 py-0">G</div>
                    </div>;
                }

                if (!s.atis_code && s.facility === 4) {
                    twrIcon = <div className="bg-red-500 text-center" title="Tower">
                        <div className="px-0.5 py-0">T</div>
                    </div>;
                }
            });
        }
        const iconNumbers = [atisIcon, delIcon, gndIcon, twrIcon].filter(Boolean);

        const iconClass = `grid grid-cols-${iconNumbers.length.toString()} text-[8px] w-full`;
        console.log(services[0].callsign, iconNumbers.length, iconClass);
        return (
            <div className={iconClass}>
                {atisIcon}
                {delIcon}
                {gndIcon}
                {twrIcon}
            </div>
        );
    };

    const handleMarkerClick = (e) => {
        //e.stopPropagation();
        console.log("Event click:", e);
    };

    const renderMarkers = () => {
        return data.map((a) => {
            const serviceIcons = generateServiceLabels(a.services);
            const icao = <div className="font-semibold opacity-80 text-gray-50">
                {a.icao}
            </div>;

            return (
                <Marker
                    onClick={() => console.log("MAP ONCLICK")}
                    style={{ zIndex: 10 }}
                    longitude={Number(a.coordinates[0])}
                    latitude={Number(a.coordinates[1])}
                    scale={1.5}
                    key={a.icao}
                    anchor="bottom">
                    <div
                        className="grid grid-cols-1 text-center text-[9px] text-gray-50 bg-gray-500 px-0.5 z-10"
                        onClick={(e) => handleMarkerClick(e)}
                    >
                        {icao}
                        {serviceIcons}
                    </div>
                </Marker>
            );
        });
    };


    return (
        <div>
            {renderMarkers()}
        </div>
    );
};

export default ControllerMarker;