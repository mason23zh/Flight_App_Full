import GeoJson from "geojson";
import React, { useMemo } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";

const useRenderTraconLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    const [hoverTracon, handleMouse] = useDelayHoverLabel();
    const hoverTraconCast = hoverTracon as GeoJson.FeatureCollection;

    const renderMarkers = (geoJsonFeatures: GeoJson.FeatureCollection) => {
        if (geoJsonFeatures) {
            return geoJsonFeatures.features.map((feature) => {
                if ("coordinates" in feature.geometry) {
                    const lon = feature.geometry.coordinates[0][0][0][0];
                    const lat = feature.geometry.coordinates[0][0][0][1];
                    return (
                        <Marker
                            style={{ zIndex: 30 }}
                            key={feature.properties.id + feature.properties.prefix[0]}
                            longitude={Number(lon)}
                            latitude={Number(lat)}
                        >
                            <div
                                className="bg-blue-400 text-center rounded-md py-0 px-1 text-[11px] text-black"
                                onMouseEnter={() => handleMouse({
                                    type: "FeatureCollection",
                                    features: [feature]
                                }, true, 150, 10)}
                                onMouseLeave={() => handleMouse(null, false, 150, 10)}
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
        hoverTraconCast
    };
};

export default useRenderTraconLabelMarker;