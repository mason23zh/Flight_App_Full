import { FallbackTracon } from "./useMatchTracon";
import useDelayHoverLabel from "./useDelayHoverLabel";
import { Marker } from "react-map-gl";
import React, { useMemo } from "react";

const useRenderUnMatchedTraconLabelMarkers = (fallbackTracon: FallbackTracon[]) => {
    const [hoverTracon, handleMouse] = useDelayHoverLabel();
    const hoverTraconCast = hoverTracon as unknown as FallbackTracon;

    const renderMarkers = (fallbackTracon: FallbackTracon[]) => {
        if (fallbackTracon && fallbackTracon.length !== 0) {
            return fallbackTracon.map((tracon) => {
                if (tracon.edgeCoordinates.length > 0) {
                    const lon = tracon.edgeCoordinates[0];
                    const lat = tracon.edgeCoordinates[1];

                    return (
                        <Marker
                            style={{ zIndex: 30 }}
                            key={tracon.controllers[0].callsign || tracon.center[0]}
                            longitude={Number(lon)}
                            latitude={Number(lat)}
                        >
                            <div
                                className="bg-blue-400 text-center rounded-md py-0 px-1 text-[11px] text-black"
                                onMouseEnter={() => handleMouse(tracon, true, 150, 10)}
                                onMouseLeave={() => handleMouse(null, false, 150, 10)}
                            >
                                {tracon.controllers[0].callsign || tracon.center[0]}
                            </div>
                        </Marker>
                    );
                }
            });
        }
        return null;
    };

    const renderedMarkers = useMemo(() => {
        return renderMarkers(fallbackTracon);
    }, [fallbackTracon]);

    return {
        renderedMarkers,
        hoverTraconCast
    };
};

export default useRenderUnMatchedTraconLabelMarkers;