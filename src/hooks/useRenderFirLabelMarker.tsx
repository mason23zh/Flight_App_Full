import GeoJson from "geojson";
import React, { useCallback, useEffect, useState } from "react";
import { Marker } from "react-map-gl";

const useRenderFirLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    const [hoverFir, setHoverFir] = useState<GeoJson.FeatureCollection>(null);
    const [hoverDelayHandler, setHoverDelayHandler] = useState(null);
    let renderedMarkers;

    const handleOnMouseOver = useCallback((feature: GeoJson.Feature) => {
        if (hoverDelayHandler) {
            clearTimeout(hoverDelayHandler);
        }

        const handler = setTimeout(() => {
            setHoverFir({
                type: "FeatureCollection",
                features: [feature]
            });
        }, 150);

        setHoverDelayHandler(handler);
    }, [hoverDelayHandler]);

    const handleOnMouseLeave = useCallback(() => {
        // Clear the timeout when the mouse leaves.
        if (hoverDelayHandler) {
            clearTimeout(hoverDelayHandler);
        }

        const handler = setTimeout(() => {
            setHoverFir(null);
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


    if (geoJsonFeatures) {
        renderedMarkers = geoJsonFeatures.features.map((feature) => {
            return (
                <Marker
                    style={{ zIndex: 50 }}
                    key={feature.properties.id}
                    longitude={Number(feature.properties.label_lon)}
                    latitude={Number(feature.properties.label_lat)}

                >
                    <div
                        onMouseEnter={() => handleOnMouseOver(feature)}
                        onMouseLeave={handleOnMouseLeave}
                        className="bg-amber-50 text-center rounded-md py-0 px-1 text-[11px] font-bold text-black opacity-80">
                        {feature.properties.id}
                    </div>
                </Marker>);
        });
    }

    return {
        renderedMarkers,
        hoverFir
    };
};

export default useRenderFirLabelMarker;


