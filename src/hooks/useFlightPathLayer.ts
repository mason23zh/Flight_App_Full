import { VatsimFlight, VatsimTrackTraffic } from "../types";
import { useMemo } from "react";
import { LineLayer } from "@deck.gl/layers/typed";
import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";
//TODO: ERROR handle?
const useFlightPathLayer = (
    data: VatsimTrackTraffic,
    selectTraffic: VatsimFlight,
    trafficData: Array<VatsimFlight>,
    visible: boolean,
    terrainEnable: boolean
) => {
    const formatTrack = useMemo(() => {
        const track = [];
        if (data && selectTraffic) {
            data.track.forEach((t, idx) => {
                const tempObj = {
                    from: { coordinates: [] },
                    to: { coordinates: [] }
                };

                if (!t.longitude) return;

                if (idx < data.track.length - 1) {
                    tempObj.from.coordinates = [t.longitude, t.latitude, terrainEnable ? t.altitude : 0];
                    tempObj.to.coordinates = [
                        data.track[idx + 1].longitude,
                        data.track[idx + 1].latitude,
                        terrainEnable ? data.track[idx + 1].altitude : 0
                    ];
                } else if (idx === data.track.length - 1) {
                    // For the last segment, update with current traffic data
                    const selectedObj = trafficData.find((o) => o.callsign === selectTraffic.callsign);
                    tempObj.from.coordinates = [t.longitude, t.latitude, terrainEnable ? t.altitude : 0];
                    tempObj.to.coordinates = [
                        selectedObj?.longitude || 0,
                        selectedObj?.latitude || 0,
                        terrainEnable ? selectedObj?.altitude || 0 : 0
                    ];
                }
                track.push(tempObj);
            });
        }
        return track;
    }, [data, selectTraffic, trafficData, terrainEnable]);

    return useMemo(() => {

        return new LineLayer({
            id: "flight-path",
            data: formatTrack,
            getColor: () => [255, 140, 0],
            getSourcePosition: (d) => d.from.coordinates,
            getTargetPosition: (d) => d.to.coordinates,
            getWidth: 3,
            widthMaxPixels: Number.MAX_SAFE_INTEGER,
            widthMinPixels: 0,
            widthScale: 1,
            widthUnits: "pixels",
            // autoHighlight: false,
            // coordinateOrigin: [0, 0, 0],
            coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
            highlightColor: [0, 0, 128, 128],
            modelMatrix: null,
            opacity: 1,
            pickable: false,
            visible: visible,
            wrapLongitude: true,
            updateTriggers: {
                getSourcePosition: formatTrack.map(t => t.from.coordinates.join(",")),  // Trigger update when track changes
                getTargetPosition: formatTrack.map(t => t.to.coordinates.join(",")),  // Trigger update when track changes
            }
        });
    }, [data, selectTraffic, trafficData, terrainEnable]);
};

export default useFlightPathLayer;