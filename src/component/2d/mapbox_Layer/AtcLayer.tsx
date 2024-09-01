import React, { useEffect, useMemo, useState } from "react";
import {
    addMessage,
    removeMessageByLocation,
    RootState,
    useFetchVatsimControllersDataQuery,
    useFetchVatsimFirBoundariesQuery
} from "../../../store";
import FirLayer from "./FIR_Layers/FirLayer";
import TraconLayer from "./Tracon_Layers/TraconLayer";
import ControllerMarkerLayer from "./Controller_Markers_Layer/ControllerMarkerLayer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FirUnderlineLayer from "./FIR_Layers/FirUnderlineLayer";
// import { useViewState } from "../viewStateContext";
import { useMapRefContext } from "../MapRefContext";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import filterFirGeoJsonInViewport from "../filterFirGeoJsonInViewport";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
// import geoJsonData from "../../../assets/vatsim_geoJson/simplified_vatsim_firboundaries.json";
// import testData from "../../../assets/getvatsimcontrollers-missing-lppo-kzny.json";
// import testData from "../../../test_data/vatsim-czeg-fss.json";
import testData from "../../../test_data/getvatsimcontrollers-mismatch-edgg-edmm.json";
import { useMap } from "react-map-gl";
import { VatsimControllers } from "../../../types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface AtcLayerProps {
    controllerData: VatsimControllers | null;
    controllerLoading: boolean;
    controllerError: SerializedError | FetchBaseQueryError;
}

const AtcLayer = ({
    controllerData,
    controllerError,
    controllerLoading
}: AtcLayerProps) => {
    const dispatch = useDispatch();
    // const viewState = useViewState();
    const mapRef = useMapRefContext();


    const [previousBounds, setPreviousBounds] = useState<[number, number, number, number] | null>(null);
    const [previousZoom, setPreviousZoom] = useState<number | null>(null);

    const {
        allAtcLayerVisible,
        underlineFirBoundaries
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    //update controller info every 60 seconds
    // const {
    //     data: NewControllerData,
    //     error: controllerError,
    //     isLoading: controllerLoading
    // } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });

    const {
        data: geoJsonData,
        error: geoJsonError,
        isLoading: geoJsonLoading
    } = useFetchVatsimFirBoundariesQuery();

    useEffect(() => {
        if (controllerLoading || geoJsonLoading) {
            dispatch(addMessage({
                location: "ATC",
                messageType: "LOADING",
                content: "Loading controllers..."
            }));
        }

        if (controllerError || geoJsonError) {
            dispatch(addMessage({
                location: "ATC",
                messageType: "ERROR",
                content: "Error loading controllers data."
            }));
        }

        if (controllerData &&
                geoJsonData &&
                !controllerLoading &&
                !controllerError &&
                !geoJsonLoading &&
                !geoJsonError) {
            dispatch(removeMessageByLocation({ location: "ATC" }));
        }
    }, [controllerError, controllerLoading, controllerData]);

    const currentBounds = useMemo(() => {
        if (!mapRef.current) return null;
        const map = mapRef.current.getMap();
        const bounds = map.getBounds();
        console.log("Current bounds:", bounds);
        return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()] as [number, number, number, number];
    }, [mapRef]);

    // useEffect(() => {
    //     if (!mapRef.current) {
    //         console.log("Map ref not exist.");
    //         return null;
    //     }
    //     const map = mapRef.current.getMap();
    //     console.log("Bounds::", map.getBounds()
    //         .getNorth());
    // }, [mapRef]);

    //
    // useEffect(() => {
    //     if (!mapRef.current) {
    //         console.log("Map ref not exist.");
    //         return;
    //     }
    //
    //     const map = mapRef.current.getMap();
    //
    //     // Whenever mapRef changes, use the latest bounds
    //     const bounds = map.getBounds();
    //     console.log("Bounds::", bounds.getNorth());
    // }, [mapRef, mapRef?.current]);


    const currentZoom = useMemo(() => {
        return mapRef.current?.getMap()
            .getZoom() ?? null;
    }, [mapRef]);

    const isDragging = mapRef.current?.isDragging ?? false;

    //
    // const currentBounds = useMemo(() => {
    //     return new WebMercatorViewport({
    //         longitude: viewState.longitude,
    //         latitude: viewState.latitude,
    //         zoom: viewState.zoom,
    //         width: viewState.width,
    //         height: viewState.height
    //     }).getBounds();
    // }, [viewState]);

    // const filteredGeoJsonData = useMemo(() => {
    //     if (!geoJsonData || !currentBounds || !currentZoom) return null;
    //
    //     const filteredData = filterFirGeoJsonInViewport(
    //             geoJsonData as FeatureCollection<Polygon | MultiPolygon>,
    //             currentBounds,
    //             previousBounds,
    //             currentZoom,
    //             previousZoom,
    //             isDragging
    //     );
    //
    //     // Update previous bounds and zoom level if not dragging
    //     if (!isDragging || (previousZoom && previousZoom !== currentZoom)) {
    //         setPreviousBounds(currentBounds);
    //         setPreviousZoom(currentZoom);
    //     }
    //
    //     return filteredData;
    // }, [geoJsonData, currentBounds, previousBounds, currentZoom, previousZoom, isDragging]);


    const newControllerData = useMemo(() => controllerData, [JSON.stringify(controllerData)]);

    return (
        <>
            {underlineFirBoundaries && <FirUnderlineLayer/>}
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={newControllerData} labelVisible={true}/>
                <TraconLayer controllerInfo={newControllerData} labelVisible={true}/>
                {/* <ControllerMarkerLayer controllerInfo={controllerData} labelVisible={true}/> */}
            </>)
            }
        </>
    );
};

export default AtcLayer;