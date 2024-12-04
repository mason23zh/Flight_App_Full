import { VatsimFlight, VatsimTrackTraffic } from "../types";
import { useMemo } from "react";
import { LineLayer } from "@deck.gl/layers/typed";
import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";
import chroma from "chroma-js";

//TODO: formatTrack triggered too many times
//TODO: improve the gradient path color
//TODO: Change the max height altitude for gradient using filed flight plan altitude

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
                    // this filedAltitude will be used as the max number to calculate the path color
                    // if no number, default max altitude to FL400
                    filedAltitude: Number(selectTraffic?.flight_plan?.altitude || 40000),
                    from: {
                        coordinates: [],
                        altitude: 0,
                    },
                    to: {
                        coordinates: [],
                        altitude: 0
                    }
                };

                if (!t.longitude) return;

                if (idx < data.track.length - 1) {
                    tempObj.from.coordinates = [t.longitude, t.latitude, terrainEnable ? t.altitude : 0];
                    tempObj.to.coordinates = [
                        data.track[idx + 1].longitude,
                        data.track[idx + 1].latitude,
                        terrainEnable ? data.track[idx + 1].altitude : 0
                    ];
                    tempObj.from.altitude = t?.altitude || 0;
                    tempObj.to.altitude = data.track[idx + 1]?.altitude || 0;
                } else if (idx === data.track.length - 1) {
                    // For the last segment, update with current traffic data
                    const selectedObj = trafficData.find((o) => o.callsign === selectTraffic.callsign);
                    tempObj.from.coordinates = [t.longitude, t.latitude, terrainEnable ? t.altitude : 0];
                    tempObj.to.coordinates = [
                        selectedObj?.longitude || 0,
                        selectedObj?.latitude || 0,
                        terrainEnable ? selectedObj?.altitude || 0 : 0
                    ];
                    tempObj.from.altitude = t?.altitude || 0;
                    tempObj.to.altitude = selectedObj?.altitude || 0;
                }
                track.push(tempObj);
            });
        }
        return track;
    }, [data, selectTraffic, trafficData, terrainEnable]);

    // console.log("Format track:", formatTrack);

    const colStart = chroma(240, 0.7, 0.45, "hsl"); // Blue (low altitude)
    const colEnd = chroma(0, 0.7, 0.45, "hsl"); // Red (high altitude)

    return useMemo(() => {

        return new LineLayer({
            id: "flight-path",
            data: formatTrack,
            getColor: (d) => {
                const altitudeRange = d.filedAltitude; // Max altitude
                const avgAltitude = (d.from.altitude + d.to.altitude) / 2;

                // Normalize altitude to [0, 1]
                const normalizedAltitude = Math.min(Math.max(avgAltitude, 0), altitudeRange) / altitudeRange;

                // Interpolate color using chroma.mix
                const color = chroma.mix(colStart, colEnd, normalizedAltitude, "hsl")
                    .rgb();

                return [color[0], color[1], color[2]]; // Return RGB color
            },
            // getColor: () => [255, 140, 0],
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