import React from "react";
import { PopularVatsimAirport } from "../../../../types";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
    openSearchResults,
    setFilterAircraftOnMap_aircraft,
    setFilterAircraftOnMap_airport,
    setMapSearchSelectedAirport, setTrafficTracking,
    toggleSearchBox
} from "../../../../store";
import { useLiveQuery } from "dexie-react-hooks";
import { searchAirportByIdent } from "../search_box/mapSearchFunction";
import { useMap } from "react-map-gl";

interface Props {
    featuredAirport: PopularVatsimAirport;
}

const serviceStyles = {
    DEL: "bg-blue-500",
    GND: "bg-green-500",
    TWR: "bg-red-500",
    APP: "bg-purple-500",
    ATIS: "bg-yellow-500",
};

const serviceLabels = {
    DEL: "D",
    GND: "G",
    TWR: "T",
    APP: "A",
    ATIS: "A",
};

const FeaturedAirportElement = ({ featuredAirport }: Props) => {
    const dispatch = useDispatch();
    const { current: mapRef } = useMap();
    const activeServices = Object.keys(featuredAirport.controller)
        .filter(service => featuredAirport.controller[service]);
    const {
        arrivalNumber,
        departureNumber,
        station
    } = featuredAirport;

    // Get local airport from the indexDB
    const dbAirport = useLiveQuery(
        async () => {
            try {
                const airports = await searchAirportByIdent(featuredAirport.ICAO);
                return { airports };
            } catch (e) {
                console.error("Error Searching:", e);
                return { airports: [] };
            }
        },
        [featuredAirport],
        { airports: [] }
    );

    const arrivalTraffic = (arrivalNumber && arrivalNumber > 0)
        ? (
            <div className="flex items-center font-bold ">
                <FaPlaneArrival size={15}/>
                <div>{arrivalNumber}</div>
            </div>
        )
        : <></>;

    const departureTraffic = (departureNumber && departureNumber > 0)
        ? (
            <div className="flex items-center">
                <FaPlaneDeparture size={15}/>
                <div>{departureNumber}</div>
            </div>
        )
        : <></>;

    const handleOnClick = () => {
        // dispatch selected airport data to airport arrival panel
        dispatch(setMapSearchSelectedAirport(dbAirport.airports[0]));
        // close the search box
        dispatch(toggleSearchBox(false));
        //remove other filter if they are set
        dispatch(setFilterAircraftOnMap_aircraft(false));
        // filter traffic on the map
        dispatch(setFilterAircraftOnMap_airport(true));
        // Open search result list
        dispatch(openSearchResults("AIRPORT"));
        // make sure the flight tracking is off
        dispatch(setTrafficTracking(false));
        if (mapRef) {
            const map = mapRef?.getMap();
            if (map) {
                map.flyTo({
                    center: [Number(station.geometry.coordinates[0]),
                        Number(station.geometry.coordinates[1])],
                    zoom: 13
                });
            }
        }
    };

    return (
        <div
            className="grid grid-cols-3 justify-between gap-4 p-2
          shadow-sm hover:rounded-sm border-b border-slate-400
          hover:bg-gray-600 hover:cursor-pointer"
            onClick={handleOnClick}
        >
            <div className="col-span-1 self-center">
                {featuredAirport.ICAO}
            </div>

            <div className="col-span-1 self-center">
                {featuredAirport.station?.country.country_name}
            </div>

            <div className="col-span-1 self-center">
                <div className={`flex flex-col items-center col-span-2 ${activeServices.length === 0 ? "justify-center" : "justify-between"}`}>
                    {/* Top section: Arrival and Departure Traffic */}
                    <div className="flex gap-2 mb-1">
                        {departureTraffic}
                        {arrivalTraffic}
                    </div>

                    {/* Bottom section: Controller Services (only shown if available) */}
                    {activeServices.length > 0 && (
                        <div className="flex w-full max-w-[150px] h-4 overflow-hidden justify-center">
                            {activeServices.map((service, index) => (
                                <span
                                    key={service}
                                    className={`flex items-center justify-center text-white font-bold text-xs px-[5px] py-1 ${
                                        serviceStyles[service]
                                    } ${
                                        activeServices.length === 1
                                            ? "rounded-l-lg rounded-r-lg" // If only one element, round both sides
                                            : index === 0
                                                ? "rounded-l-lg" // Round left edge for the first element
                                                : index === activeServices.length - 1
                                                    ? "rounded-r-lg" // Round right edge for the last element
                                                    : ""
                                    }`}
                                    title={service}
                                >
                                    {serviceLabels[service]}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedAirportElement;