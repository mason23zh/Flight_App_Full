import { IconLayer } from "@deck.gl/layers/typed";
import generateFirIcon from "../mapbox_Layer/util/generateFirIcon";
import { MatchedFir } from "../../../hooks/useMatchedFirs";


const firIconLayer = (
    matchedFirs: MatchedFir[],
    onHoverFirCallback: (firInfo: MatchedFir) => void,
    visible: boolean) => {

    if (!matchedFirs || matchedFirs.length === 0 || !visible) return null;

    const iconData = matchedFirs.map((feature) => {
        const coordinates = [Number(feature.firInfo?.entries[0]?.label_lon), Number(feature.firInfo?.entries[0]?.label_lat)];
        if (feature.isInFss || feature.firInfo.isFss) {
            return {
                position: coordinates,
                iconUrl: generateFirIcon(feature.firInfo.firBoundary, true),
                firInfo: feature,
            };
        }

        return {
            position: coordinates,
            iconUrl: generateFirIcon(feature.firInfo.firBoundary, false),
            firInfo: feature
        };
    });

    return new IconLayer({
        id: "fir-icon-layer",
        data: iconData,
        pickable: true,
        getPosition: d => d.position,
        getIcon: d => ({
            url: d.iconUrl,
            width: 130,
            height: 70,
            anchorY: 70,
            // anchorX: 50,
        }),
        sizeScale: 1,
        getSize: () => 30,
        onHover: ({ object }) => {
            if (object) {
                onHoverFirCallback(object.firInfo);
            } else {
                onHoverFirCallback(null);
            }
        },
        // getColor: () => [0, 0, 0, 255],
        parameters: { depthTest: false }
    });
};

export default firIconLayer;