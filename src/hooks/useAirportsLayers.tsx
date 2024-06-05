import SmallAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/SmallAirportLayer";
import MediumAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/MediumAirportLayer";
import LargeAirportLayer from "../component/2d/mapbox_Layer/Airport_Layers/LargeAirportLayer";
import MapboxSourceLayer from "../component/2d/mapbox_Layer/Airport_Layers/MapboxSourceLayer";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useAirportsLayers = () => {
    const { airportLabelVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    //Render different number of airports based on map's zoom level
    const layers = <MapboxSourceLayer>
        <SmallAirportLayer displayLabel={airportLabelVisible}/>
        <MediumAirportLayer displayLabel={airportLabelVisible}/>
        <LargeAirportLayer displayLabel={airportLabelVisible}/>
    </MapboxSourceLayer>;

    return { airportLayers: layers };
};

export default useAirportsLayers;