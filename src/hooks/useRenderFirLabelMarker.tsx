import GeoJson from "geojson";
import React from "react";
import { Marker } from "react-map-gl";

const useRenderFirLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;

    if (geoJsonFeatures) {
        renderedMarkers = geoJsonFeatures.features.map((feature) => {
            return (
                <Marker
                    key={feature.properties.id}
                    longitude={Number(feature.properties.label_lon)}
                    latitude={Number(feature.properties.label_lat)}
                    onClick={(e) => console.log("Fir label on click:", e)}

                >
                    <div className="bg-amber-50 text-center rounded-md py-0 px-1 text-[11px] font-bold text-black opacity-80">
                        {feature.properties.id}
                    </div>
                </Marker>);
        });
    }

    return { renderedMarkers };
};

export default useRenderFirLabelMarker;


