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
import { useViewState } from "../viewStateContext";
import { WebMercatorViewport } from "@deck.gl/core/typed";
import filterFirGeoJsonInViewport from "../filterFirGeoJsonInViewport";
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
// import geoJsonData from "../../../assets/vatsim_geoJson/simplified_vatsim_firboundaries.json";
// import testData from "../../../assets/getvatsimcontrollers-missing-lppo-kzny.json";
// import testData from "../../../test_data/vatsim-czeg-fss.json";
import testData from "../../../assets/getvatsimcontrollers-mismatch-edgg-edmm.json";

const AtcLayer = () => {
    const dispatch = useDispatch();
    const viewState = useViewState();

    const [previousBounds, setPreviousBounds] = useState<[number, number, number, number] | null>(null);
    const [previousZoom, setPreviousZoom] = useState<number | null>(null);

    const {
        allAtcLayerVisible,
        underlineFirBoundaries
    } = useSelector((state: RootState) => state.vatsimMapVisible);


    //update controller info every 60 seconds
    const {
        data: controllerData,
        error: controllerError,
        isLoading: controllerLoading
    } = useFetchVatsimControllersDataQuery(undefined, { pollingInterval: 60000 });

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
        return new WebMercatorViewport({
            longitude: viewState.longitude,
            latitude: viewState.latitude,
            zoom: viewState.zoom,
            width: viewState.width,
            height: viewState.height
        }).getBounds();
    }, [viewState]);

    const filteredGeoJsonData = useMemo(() => {
        if (!geoJsonData) return null;

        const filteredData = filterFirGeoJsonInViewport(
                geoJsonData as FeatureCollection<Polygon | MultiPolygon>,
                currentBounds,
                previousBounds,
                viewState.zoom,
                previousZoom,
                viewState.isDragging
        );

        // Update previous bounds and zoom level if not dragging
        if (!viewState.isDragging || (previousZoom && (previousZoom !== viewState.zoom))) {
            setPreviousBounds(currentBounds);
            setPreviousZoom(viewState.zoom);
        }

        return filteredData;
    }, [geoJsonData, currentBounds, previousBounds, viewState.zoom, previousZoom, viewState.isDragging]);

    const memoFilteredGeoJsonData = useMemo(() => filteredGeoJsonData,
        [filteredGeoJsonData?.features.length]
    );

    return (
        <>
            {underlineFirBoundaries && <FirUnderlineLayer/>}
            {allAtcLayerVisible && (<>
                <FirLayer controllerInfo={controllerData} labelVisible={true}/>
                <TraconLayer controllerInfo={controllerData} labelVisible={true}/>
                <ControllerMarkerLayer controllerInfo={controllerData} labelVisible={true}/>
            </>)
            }
        </>
    );
};

export default AtcLayer;