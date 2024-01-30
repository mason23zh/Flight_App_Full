import GeoJson from "geojson";
import React from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";

const useRenderFirLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;
    const [hoverFir, handleMouse] = useDelayHoverLabel();

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
                        onMouseEnter={() => handleMouse({
                            type: "FeatureCollection",
                            features: [feature]
                        }, true, 150, 100)}
                        onMouseLeave={() => handleMouse(null, false, 150, 100)}
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


