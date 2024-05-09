import GeoJson from "geojson";
import React, { useEffect, useMemo } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";
import { useDispatch, useSelector } from "react-redux";
import { getOverLappedFirs, RootState } from "../store";
import { MatchedFirs } from "../types";

const useRenderFssLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;
    const dispatch = useDispatch();
    const onlineFirs = useSelector<RootState, MatchedFirs>((state) => state.vatsimMapController.onlineFirs);
    const onlineFss = useSelector<RootState>((state) => state.vatsimMapController.onlineFssList);

    useEffect(() => {
        // Get over-lapped firs
        // These FIRs are within the FSS if they are both online
        dispatch(getOverLappedFirs());
    }, [dispatch, onlineFirs, onlineFss]);

    const overLappedFirs = useSelector<RootState>((state) => state.vatsimMapController.overLappedFirs);
    // console.log("Over lapped firs:", overLappedFirs);

    const [hoverFss, handleMouse] = useDelayHoverLabel();


    const handleMouseEnter = (feature: GeoJson.Feature) => {
        handleMouse({
            type: "FeatureCollection",
            features: [feature]
        }, true, 150, 10);
    };

    const handleMouseLeave = () => {
        handleMouse(null, false, 150, 10);
    };

    renderedMarkers = useMemo(() => {
        if (geoJsonFeatures && geoJsonFeatures.features.length > 0) {
            renderedMarkers = geoJsonFeatures.features.map((feature) => {
                // if (Object.keys(onlineFirs).length !== 0) {
                //     if (Object.prototype.hasOwnProperty.call(onlineFirs, feature.properties.id)) {
                //         return null;
                //     }
                //                }
                return (
                    <Marker
                        style={{ zIndex: 50 }}
                        key={feature.properties.id}
                        longitude={Number(feature.properties.label_lon)}
                        latitude={Number(feature.properties.label_lat)}

                    >
                        <div
                            onMouseEnter={() => handleMouseEnter(feature)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="flex flex-col text-[11px] text-black text-center">
                                <div className="bg-blue-500 rounded-t-md px-1 py-[1px] opacity-80 font-bold text-[10px]
                             leading-tight ">
                                    FSS
                                </div>
                                <div className="bg-amber-50 rounded-b-md px-1 py-0 opacity-80 font-bold">
                                    {feature.properties.id}
                                </div>
                            </div>
                        </div>
                    </Marker>
                );
            })
                .filter(marker => marker !== null);
        }
        return renderedMarkers;
    }, [onlineFirs, geoJsonFeatures]);

    return {
        renderedMarkers,
        hoverFss
    };
};

export default useRenderFssLabelMarker;