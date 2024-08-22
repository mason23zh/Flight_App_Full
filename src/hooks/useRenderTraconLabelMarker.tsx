import React, { useMemo } from "react";
import { Marker } from "react-map-gl";
import useDelayHoverLabel from "./useDelayHoverLabel";
import { MatchedTracon } from "./useMatchTracon";

const useRenderTraconLabelMarker = (matchedTracon: MatchedTracon[]) => {
    const [hoverTracon, handleMouse] = useDelayHoverLabel();
    const hoverTraconCast = hoverTracon as unknown as MatchedTracon;

    const renderMarkers = (matchedTracon: MatchedTracon[]) => {
        if (matchedTracon && matchedTracon.length !== 0) {
            return matchedTracon.map((tracon) => {
                if (tracon.traconInfo.coordinate.length > 1) {
                    const lon = tracon.traconInfo.coordinate[0];
                    const lat = tracon.traconInfo.coordinate[1];
                    return (
                        <Marker
                            style={{ zIndex: 30 }}
                            key={tracon.traconInfo.id}
                            longitude={Number(lon)}
                            latitude={Number(lat)}
                        >
                            <div
                                className="bg-blue-400 text-center rounded-md py-0 px-1 text-[11px] text-black"
                                onMouseEnter={() => handleMouse(tracon, true, 150, 10)}
                                onMouseLeave={() => handleMouse(null, false, 150, 10)}
                            >
                                {tracon.traconInfo.id}
                            </div>
                        </Marker>
                    );
                }
            });
        }
    };

    const renderedMarkers = useMemo(() => {
        return renderMarkers(matchedTracon);
    }, [matchedTracon]);


    return {
        renderedMarkers,
        hoverTraconCast
    };
};

export default useRenderTraconLabelMarker;