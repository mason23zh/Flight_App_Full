import GeoJson from "geojson";
import React from "react";
import { Marker } from "react-map-gl";

const useRenderTraconLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;

    if (geoJsonFeatures) {
        renderedMarkers = geoJsonFeatures.features.map((feature) => {
            console.log("Tracon marker label:", feature.properties.id);

            if ("coordinates" in feature.geometry) {
                const lon = feature.geometry.coordinates[0][0][0][0];
                const lat = feature.geometry.coordinates[0][0][0][1];
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
    return { renderedMarkers };
};

export default useRenderTraconLabelMarker;