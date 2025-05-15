import React, { useMemo } from "react";
import { RootState, useFetchTrafficTrackDataQuery } from "../../../../store";
import { useSelector } from "react-redux";
import { TrackObj } from "../../../../types";
import { GeoJSON } from "geojson";
import { Layer, Source } from "react-map-gl";

const VatsimTrafficPathLayer = () => {

    const { selectedTraffic } = useSelector((state: RootState) => state.vatsimMapTraffic);

    const {
        data: trackData,
        error: trackError,
        isLoading: trackLoading
    } = useFetchTrafficTrackDataQuery(selectedTraffic?.callsign ?? "", {
        skip: !selectedTraffic || selectedTraffic.cid === 0
    });


    /*
    * Reference to: https://docs.mapbox.com/mapbox-gl-js/example/line-across-180th-meridian/
    *
    * */
    const adjustAntimeridianCrossing = (coordinates) => {
        if (coordinates.length < 2) return coordinates; // No adjustment needed for fewer than 2 points

        const adjustedCoordinates = [coordinates[0]]; // Start with the first point

        for (let i = 1; i < coordinates.length; i++) {
            const [prevLng] = adjustedCoordinates[adjustedCoordinates.length - 1];
            const [currLng, currLat] = coordinates[i];

            let adjustedLng = currLng;

            // Adjust for antimeridian crossing
            if (currLng - prevLng >= 180) {
                adjustedLng -= 360;
            } else if (currLng - prevLng <= -180) {
                adjustedLng += 360;
            }

            adjustedCoordinates.push([adjustedLng, currLat]);
        }

        return adjustedCoordinates;
    };


    const geoJsonData = useMemo(() => {
        if (!trackData || !trackData?.data || trackLoading || trackError || !selectedTraffic) return null;

        const normalizedCoordinates = trackData.data.track.map(({
            longitude,
            latitude
        }: TrackObj) => [
            ((longitude + 180) % 360 + 360) % 360 - 180, // Normalize longitude
            latitude
        ])
            .filter(([longitude, latitude]) => longitude !== 0 || latitude !== 0); // filter out [0,0] coordinates

        const currentTrafficCoordinates = [
            ((selectedTraffic.longitude + 180) % 360 + 360) % 360 - 180, // Normalize current longitude
            selectedTraffic.latitude
        ];

        normalizedCoordinates.push(currentTrafficCoordinates);

        // Adjust for antimeridian crossing
        const adjustedCoordinates = adjustAntimeridianCrossing(normalizedCoordinates);


        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: adjustedCoordinates,
                    },
                    properties: {}
                }
            ]
        } as GeoJSON;

    }, [trackData, trackLoading, trackError, selectedTraffic]);

    if (trackLoading || trackError || !geoJsonData) return null;

    return (
        <Source
            id="flght-path-globe"
            type="geojson"
            data={geoJsonData}
        >
            <Layer
                id="flight-path-layer-globe"
                // beforeId="vatsim-traffic-globe-layer"
                type="line"
                layout={{
                    "line-cap": "round",
                    "line-join": "round"
                }}
                paint={{
                    "line-color": "#4855BF",
                    "line-width": 3,
                    "line-opacity": 0.8
                }}
            />
        </Source>
    );
};

export default React.memo(VatsimTrafficPathLayer);