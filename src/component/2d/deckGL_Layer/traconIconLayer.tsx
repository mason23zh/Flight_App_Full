import { IconLayer } from "@deck.gl/layers/typed";
import generateTraconIcon from "../mapbox_Layer/util/generateTraconIcon";
import { FallbackTracon, MatchedTracon } from "../../../hooks/useMatchTracon";
import { HoverTracon } from "../mapbox_Layer/Tracon_Layers/TraconLabelPopup";

const traconIconLayer = (
    matchedTracon: MatchedTracon[],
    matchedFallbackTracon: FallbackTracon[],
    onMatchedHoverCallback: (traconInfo: HoverTracon) => void,
    visible: boolean
) => {
    // if (!matchedTracon && !matchedFallbackTracon) return null;

    if ((matchedTracon.length === 0 && matchedFallbackTracon.length === 0) || !visible) return null;

    const matchedMatchedIconData = (!matchedTracon || matchedTracon.length === 0)
        ? []
        : matchedTracon.map((tracon) => {
            if (tracon.traconInfo.coordinates.length > 1) {
                const lon = tracon.traconInfo.coordinates[0];
                const lat = tracon.traconInfo.coordinates[1];
                const name = tracon.traconInfo.name;

                const traconHoverObj: HoverTracon = {
                    controllers: tracon.controllers,
                    traconInfo: {
                        name: name,
                        coordinates: [lon, lat],
                    }
                };

                return {
                    position: [Number(lon), Number(lat)],
                    iconUrl: generateTraconIcon(tracon.traconInfo.id),
                    traconInfo: traconHoverObj
                };
            }
        });


    const fallBackIconData = (!matchedFallbackTracon || matchedFallbackTracon.length === 0)
        ? []
        : matchedFallbackTracon.map((tracon) => {
            const lon = tracon.edgeCoordinates[0];
            const lat = tracon.edgeCoordinates[1];
            const name = (tracon.controllers && tracon.controllers.length !== 0) ?
                tracon.controllers[0].airport.name + " APP/DEP" : "-";

            const traconHoverObj: HoverTracon = {
                controllers: tracon.controllers,
                traconInfo: {
                    name: name,
                    coordinates: [lon, lat],
                }
            };

            return {
                position: [lon, lat],
                iconUrl: generateTraconIcon(tracon.controllers[0].callsign.slice(0, -4)),
                traconInfo: traconHoverObj,
            };
        });

    //"traconInfo" in hoverTracon
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
        onHover: ({ object }) => {
            if (object) {
                onMatchedHoverCallback(object.traconInfo);
            } else {
                onMatchedHoverCallback(null);
            }
        },
        // getColor: () => [0, 0, 0, 255],
        // parameters: { depthTest: false }
    });
};

export default traconIconLayer;