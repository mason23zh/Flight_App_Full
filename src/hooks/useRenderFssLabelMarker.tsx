import GeoJson from "geojson";
import React from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";

const useRenderFssLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;

    const [hoverFss, handleMouse] = useDelayHoverLabel();

    const handleMouseEnter = (feature: GeoJson.Feature) => {
        // dispatch(onMouseHoverFirLabel(feature));
        handleMouse({
            type: "FeatureCollection",
            features: [feature]
        }, true, 150, 10);
    };

    const handleMouseLeave = () => {
        // dispatch(onMouseLeaveFirLabel(null));
        handleMouse(null, false, 150, 10);
    };
    if (geoJsonFeatures && geoJsonFeatures.features.length > 0) {
        renderedMarkers = geoJsonFeatures.features.map((feature) => {
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
                            <div className="bg-amber-50 rounded-t-md px-1 py-0 opacity-80 font-bold">
                                {feature.properties.id}
                            </div>
                            <div className="bg-blue-500 rounded-b-md px-1 py-0 opacity-80 font-bold text-[10px]
                            leading-tight ">
                                FSS
                            </div>
                        </div>

                    </div>
                </Marker>);
        });
    }

    return {
        renderedMarkers,
        hoverFss
    };
};

export default useRenderFssLabelMarker;