import React from "react";
import { Layer, Source } from "react-map-gl";
import { nexradLayerStyle } from "./nexradMapStyle";
import { RootState, useFetchRainviewerTimeStampsQuery } from "../../../../store";
import ErrorLoadingMsg from "../../ErrorLoadingMsg";
import { useSelector } from "react-redux";

const NexradLayer = ({ labelVisible }) => {
    const {
        weatherRasterVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    const {
        data: rainViewTS,
        error: rainViewError,
        isLoading: rainViewLoading
    } = useFetchRainviewerTimeStampsQuery();


    if (rainViewError) {
        return <ErrorLoadingMsg message="Error loading weather data"/>;
    }

    if (rainViewLoading) {
        return <ErrorLoadingMsg message="Loading weather data..."/>;
    }

    if (rainViewTS && weatherRasterVisible) {
        return (
            <Source
                id={"nexrad-source"}
                type="raster"
                tiles={[`https://tilecache.rainviewer.com/v2/radar/${rainViewTS[0]}/512/{z}/{x}/{y}/6/0_1.png`]}
                tileSize={256}
            >
                <Layer {...nexradLayerStyle}/>
            </Source>
        );
    }
};

export default NexradLayer;