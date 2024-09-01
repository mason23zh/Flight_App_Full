import React, { useCallback, useMemo } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";
import { MatchedFir } from "./useMatchedFirs";

const useRenderFirLabelMarker = (matchedFir: MatchedFir[]) => {
    let renderedMarkers: JSX.Element[];
    const [hoverFir, handleMouse] = useDelayHoverLabel();

    // const handleMouseEnter = (feature: MatchedFir) => {
    //     handleMouse(feature, true, 150, 10);
    // };
    //
    // const handleMouseLeave = () => {
    //     handleMouse(null, false, 150, 10);
    // };

    const handleMouseEnter = useCallback((feature: MatchedFir) => {
        handleMouse(feature, true, 150, 10);
    }, [handleMouse]);

    const handleMouseLeave = useCallback(() => {
        handleMouse(null, false, 150, 10);
    }, [handleMouse]);

    renderedMarkers = useMemo(() => {
        if (matchedFir && matchedFir.length > 0) {
            renderedMarkers = matchedFir.map((feature) => {
                if (feature.isInFss || feature.firInfo.isFss) {
                    return (
                        <Marker
                            style={{ zIndex: 50 }}
                            key={`${feature.id}`}
                            longitude={Number(feature.firInfo?.entries[0]?.label_lon)}
                            latitude={Number(feature.firInfo?.entries[0]?.label_lat)}

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
                                        {feature.firInfo.firBoundary}
                                    </div>
                                </div>
                            </div>
                        </Marker>
                    );
                }
                return (
                    <Marker
                        style={{ zIndex: 50 }}
                        key={`${feature.id}`}
                        longitude={Number(feature.firInfo?.entries[0]?.label_lon)}
                        latitude={Number(feature.firInfo?.entries[0]?.label_lat)}

                    >
                        <div
                            onMouseEnter={() => handleMouseEnter(feature)}
                            onMouseLeave={handleMouseLeave}
                            className="bg-amber-50 text-center rounded-md py-0 px-1 text-[11px] font-bold text-black opacity-80">
                            {feature.firInfo.firBoundary}
                        </div>
                    </Marker>);
            })
                .filter(marker => marker !== null);
        }
        return renderedMarkers;
    }, [matchedFir, handleMouseEnter, handleMouseLeave]);

    return {
        renderedMarkers,
        hoverFir
    };
};

export default useRenderFirLabelMarker;
