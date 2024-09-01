import { IconLayer } from "@deck.gl/layers/typed";
import generateTraconIcon from "../mapbox_Layer/util/generateTraconIcon";
import { FallbackTracon, MatchedTracon } from "../../../hooks/useMatchTracon";

const traconIconLayer = (matchedTracon: MatchedTracon[], matchedFallbackTracon: FallbackTracon[]) => {
    if (!matchedTracon && !matchedFallbackTracon) return null;
    const matchedMatchedIconData = matchedTracon.map((tracon) => {
        if (tracon.traconInfo.coordinates.length > 1) {
            const lon = tracon.traconInfo.coordinates[0];
            const lat = tracon.traconInfo.coordinates[1];

            return {
                position: [Number(lon), Number(lat)],
                iconUrl: generateTraconIcon(tracon.traconInfo.id)
            };
        }
    });

    const fallBackIconData = matchedFallbackTracon.length === 0 ?
        [] :
        matchedFallbackTracon.map((tracon) => {
            const lon = tracon.edgeCoordinates[0];
            const lat = tracon.edgeCoordinates[1];

            return {
                position: [Number[lon], Number(lat)],
                iconUrl: generateTraconIcon(tracon.controllers[0].callsign.slice(0, -4))
            };
        });

    return new IconLayer({
        id: "tracon-icon-layer",
        data: [...matchedMatchedIconData, ...fallBackIconData],
        pickable: true,
        getPosition: d => d.position,
        getIcon: d => ({
            url: d.iconUrl,
            width: 130,
            height: 50,
            anchorY: 50,
            // anchorX: 50,
        }),
        sizeScale: 0.8,
        getSize: () => 28,
        // getColor: () => [0, 0, 0, 255],
        parameters: { depthTest: false }
    });
};

export default traconIconLayer;