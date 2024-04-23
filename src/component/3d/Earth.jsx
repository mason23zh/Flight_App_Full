import React, { useEffect, useState } from "react";
import {
    Cesium3DTileset,
    Entity, EntityDescription, GeoJsonDataSource, ImageryLayer, PointGraphics, Viewer,
} from "resium";
import {
    Cartesian3, IonResource, BingMapsImageryProvider, BingMapsStyle, ArcGisMapServerImageryProvider,
} from "cesium";
import * as Cesium from "cesium";
import axios from "axios";
import PlanesEntities from "./PlanesEntities";

function Earth() {
    const [mapProvider, setMapProvider] = useState();
    const [pilots, setPilots] = useState([]);
    useEffect(() => {
        const getVatsimPilots = async () => {
            const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
            if (response && response.data.pilots > 0) {
                setPilots(response.data.pilots);
            }
        };
        getVatsimPilots();
    }, []);
    
    useEffect(() => {
        const setMap = async () => {
            // eslint-disable-next-line new-cap
            const imageProvider = await Cesium.BingMapsImageryProvider.fromUrl("https://dev.virtualearth.net", {
                key: "Aua-zSgSfJuLZ7LTB5PwrHSc_YTrWv_tvLAcb6xYNjD6ITvvtXSwncZjdlKGBUQA",
                mapStyle: BingMapsStyle.AERIAL_WITH_LABELS,
            });
            if (imageProvider) {
                setMapProvider(imageProvider);
            }
        };
        
        setMap();
        const interval = setInterval(() => setMap(), 15000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    const position = Cartesian3.fromDegrees(-18.68444, 21.32911, 10377);
    return (
        <Viewer
            timeline={false}
            skyBox={false}
            homeButton={false}
            animation={false}
            creditDisplay={false}
        >
            <ImageryLayer show imageryProvider={mapProvider} />
            {pilots.length > 0 ? <PlanesEntities pilots={pilots} /> : <></>}
        </Viewer>
    );
}

export default Earth;
 
 
