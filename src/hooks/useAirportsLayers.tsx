import SmallAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/SmallAirportLayer";
import MediumAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/MediumAirportLayer";
import LargeAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/LargeAirportLayer";
import MapboxSourceLayer from "../component/2d/mapbox_Layer/Airport_Layers/MapboxSourceLayer";
import React from "react";

const useAirportsLayers = () => {
    //Render different number of airports based on map's zoom level
    const layers = <MapboxSourceLayer>
        <SmallAirportLayer/>
        <MediumAirportLayer/>
        <LargeAirportLayer/>
    </MapboxSourceLayer>;

    return { airportLayers: layers };
};

export default useAirportsLayers;