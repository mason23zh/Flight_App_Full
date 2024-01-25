import GeoJson from "geojson";
import React, { useMemo } from "react";
import { Marker } from "react-map-gl";

const useRenderTraconLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    console.log("use render tracon label");
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
                            key={feature.properties.id + feature.properties.prefix[0]}
                            longitude={Number(lon)}
                            latitude={Number(lat)}
                        >
                            <div className="bg-blue-400 text-center rounded-md py-0 px-1 text-[11px] text-black">
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


    return { renderedMarkers };
};

export default useRenderTraconLabelMarker;