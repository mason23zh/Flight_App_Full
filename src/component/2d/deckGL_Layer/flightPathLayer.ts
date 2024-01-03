import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";
import { LineLayer } from "@deck.gl/layers/typed";
import { VatsimFlight, VatsimTrackTraffic } from "../../../types";


const flightPathLayer = (
    data: VatsimTrackTraffic,
    selectTraffic: VatsimFlight,
    trafficData: Array<VatsimFlight>,
    visible: boolean) => {
    const formatTrack = [];

    if (data && selectTraffic) {
        data.track.map((t, idx) => {
            // console.log("track data", t);
            const tempObj = {
                from: { coordinates: [] },
                to: { coordinates: [] }
            };
            if (!t.longitude) {
                return;
            }
            if (idx < data.track.length - 1) {
                tempObj.from.coordinates[0] = t.longitude;
                tempObj.from.coordinates[1] = t.latitude;
                tempObj.from.coordinates[2] = t.altitude;
                tempObj.to.coordinates[0] = data.track[idx + 1].longitude;
                tempObj.to.coordinates[1] = data.track[idx + 1].latitude;
                tempObj.to.coordinates[2] = data.track[idx + 1].altitude;
                formatTrack.push(tempObj);
            } else if (idx === data.track.length - 1) {
                // get the latest data and update the track
                if (selectTraffic && trafficData) {
                    const selectedObj = trafficData.find((o) => o.callsign === selectTraffic.callsign);
                    tempObj.to.coordinates[0] = selectedObj.longitude;
                    tempObj.to.coordinates[1] = selectedObj.latitude;
                    tempObj.to.coordinates[2] = selectedObj.altitude;
                    tempObj.from.coordinates[0] = t.longitude;
                    tempObj.from.coordinates[1] = t.latitude;
                    tempObj.from.coordinates[2] = t.altitude;
                    formatTrack.push(tempObj);
                }
            }
        });
    }

    return data && new LineLayer({
        id: "flight-path",
        data: formatTrack,
        getColor: () => [255, 140, 0],
        getSourcePosition: (d) => d.from.coordinates,
        getTargetPosition: (d) => d.to.coordinates,
        getWidth: 5,
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
    });
};

export default flightPathLayer;