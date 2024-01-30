import GeoJson from "geojson";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl";

const useRenderTraconLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    const [hoverTracon, setHoverTracon] = useState<GeoJson.FeatureCollection>(null);
    const [hoverDelayHandler, setHoverDelayHandler] = useState(null);

    console.log("use render tracon label");

    // const handleOnMouseOver = (feature: GeoJson.Feature) => {
    //     setHoverTracon({
    //         type: "FeatureCollection",
    //         features: [feature]
    //     });
    // };
    //
    // const handOnMouseLeave = () => {
    //     setHoverTracon(null);
    // };


    const handleOnMouseOver = useCallback((feature: GeoJson.Feature) => {
        if (hoverDelayHandler) {
            clearTimeout(hoverDelayHandler);
        }

        const handler = setTimeout(() => {
            setHoverTracon({
                type: "FeatureCollection",
                features: [feature]
            });
        }, 150);

        setHoverDelayHandler(handler);
    }, [hoverDelayHandler]);

    const handOnMouseLeave = useCallback(() => {
        // Clear the timeout when the mouse leaves.
        if (hoverDelayHandler) {
            clearTimeout(hoverDelayHandler);
        }

        const handler = setTimeout(() => {
            setHoverTracon(null);
        }, 150);

        setHoverDelayHandler(handler);
    }, [hoverDelayHandler]);

    // Effect to clear any timeouts when the component unmounts.
    useEffect(() => {
        return () => {
            if (hoverDelayHandler) {
                clearTimeout(hoverDelayHandler);
            }
        };
    }, [hoverDelayHandler]);


    const renderMarkers = (geoJsonFeatures: GeoJson.FeatureCollection) => {
        console.log("Render marker function run.");
        if (geoJsonFeatures) {
            return geoJsonFeatures.features.map((feature) => {
                if ("coordinates" in feature.geometry) {
                    const lon = feature.geometry.coordinates[0][0][0][0];
                    const lat = feature.geometry.coordinates[0][0][0][1];
                    console.log("Tracon label check pass.");
                    return (
                        <Marker
                            style={{ zIndex: 30 }}
                            key={feature.properties.id + feature.properties.prefix[0]}
                            longitude={Number(lon)}
                            latitude={Number(lat)}
                        >
                            <div
                                className="bg-blue-400 text-center rounded-md py-0 px-1 text-[11px] text-black"
                                onMouseEnter={() => handleOnMouseOver(feature)}
                                onMouseLeave={handOnMouseLeave}
                            >
                                {feature.properties.id}
                            </div>
                        </Marker>
                    );
                }
            });
        }
    };

    const renderedMarkers = useMemo(() => {
        return renderMarkers(geoJsonFeatures);
    }, [geoJsonFeatures]);


    return {
        renderedMarkers,
        hoverTracon
    };
};

export default useRenderTraconLabelMarker;