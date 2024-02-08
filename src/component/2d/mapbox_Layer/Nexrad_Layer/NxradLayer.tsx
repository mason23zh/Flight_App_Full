import React, { useEffect } from "react";
import { Layer, Source } from "react-map-gl";
import { nexradLayerStyle } from "./nexradMapStyle";
import { addMessage, RootState, useFetchRainviewerTimeStampsQuery } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import MapErrorMessageStack from "../../map_error_loading/MapErrorMessageStack";

const NexradLayer = () => {
    const dispatch = useDispatch();

    const {
        weatherRasterVisible
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        data: rainViewTS,
        error: rainViewError,
        isLoading: rainViewLoading
    } = useFetchRainviewerTimeStampsQuery();

    useEffect(() => {
        if (rainViewError) {
            dispatch(addMessage("Error loading weather radar data."));
        }
        if (rainViewLoading) {
            dispatch(addMessage("Loading weather radar data..."));
        }
    }, [rainViewLoading, rainViewError, rainViewTS]);


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