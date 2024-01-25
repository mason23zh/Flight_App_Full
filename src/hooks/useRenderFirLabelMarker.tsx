import GeoJson from "geojson";
import React, { useState } from "react";
import { Marker } from "react-map-gl";

const useRenderFirLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    const [hoverFir, setHoverFir] = useState<GeoJson.FeatureCollection>(null);
    let renderedMarkers;

    const handleOnMouseOver = (feature: GeoJson.Feature) => {
        console.log("Mouse enter");
        console.log("FirLabel geojson feature", feature);
        setHoverFir({
            type: "FeatureCollection",
            features: [feature]
        });
    };

    const handleOnMouseLeave = () => {
        setHoverFir(null);
    };

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


