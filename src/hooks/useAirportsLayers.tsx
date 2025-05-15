import SmallAirportLayer from "../component/map/mapbox_Layer/Airport_Layers/SmallAirportLayer";
import MediumAirportLayer from "../component/map/mapbox_Layer/Airport_Layers/MediumAirportLayer";
import LargeAirportLayer from "../component/map/mapbox_Layer/Airport_Layers/LargeAirportLayer";
import MapboxSourceLayer from "../component/map/mapbox_Layer/Airport_Layers/MapboxSourceLayer";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const useAirportsLayers = () => {
    const {
        airportLabelVisible,
        airportVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    if (!airportVisible) {
        return { airportLayers: <></> };
    }

    //Render different number of airports based on map's zoom level
    const layers = <MapboxSourceLayer>
        <SmallAirportLayer displayLabel={airportLabelVisible}/>
        <MediumAirportLayer displayLabel={airportLabelVisible}/>
        <LargeAirportLayer displayLabel={airportLabelVisible}/>
    </MapboxSourceLayer>;

    return { airportLayers: layers };
};

export default useAirportsLayers;