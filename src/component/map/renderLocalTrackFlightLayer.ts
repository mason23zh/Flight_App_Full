import { IconLayer } from "@deck.gl/layers/typed";
import navigation from "../../assets/mapbox/navigation.png";
import { LiveFlightData } from "../../types";

const renderLocalTrackFlightLayer = (
    flightData: LiveFlightData,
    visible: boolean,
    terrainEnable: boolean
) => {
    if (!visible) return null;

    return new IconLayer({
        id: "local-aircraft-tracking-layer",
        data: [flightData],
        iconAtlas: navigation,
        iconMapping: {
            arrow: {
                x: 0,
                y: 0,
                width: 512,
                height: 512,
                mask: false,
            },
        },
        getPosition: (d) => [d.longitude || 0, d.latitude || 0, terrainEnable ? d.AGL : 0],
        getAngle: (d) => -Math.round(d.heading),
        getColor: (d) => [Math.sqrt(d.exits), 140, 0],
        getIcon: () => "arrow",
        sizeScale: 5,
        getSize: 5,
    });
};

export default renderLocalTrackFlightLayer;
