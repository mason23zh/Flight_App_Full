import GeoJson from "geojson";
import React, { useMemo } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";

const useRenderFirLabelMarker = (geoJsonFeatures: GeoJson.FeatureCollection) => {
    let renderedMarkers;
    const [hoverFir, handleMouse] = useDelayHoverLabel();

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
        if (geoJsonFeatures && geoJsonFeatures?.features.length > 0) {
            renderedMarkers = geoJsonFeatures.features.map((feature) => {
                if (feature.properties.isInFss) {
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
                }
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
                            className="bg-amber-50 text-center rounded-md py-0 px-1 text-[11px] font-bold text-black opacity-80">
                            {feature.properties.id}
                        </div>
                    </Marker>);
            })
                .filter(marker => marker !== null);
        }
        return renderedMarkers;
    }, [geoJsonFeatures]);

    return {
        renderedMarkers,
        hoverFir
    };
};

export default useRenderFirLabelMarker;
