import { FallbackTracon, MatchedTracon } from "./useMatchTracon";
import { IconLayer } from "@deck.gl/layers/typed";
import { useCallback, useEffect, useMemo } from "react";
import { HoverTracon } from "../component/2d/mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import generateTraconIcon from "../component/2d/mapbox_Layer/util/generateTraconIcon";
import { debounce } from "lodash";
import { setHoveredTracon } from "../store";
import { useDispatch } from "react-redux";

const useTraconIconLayer = (
    matchedTracon: MatchedTracon[],
    matchedFallbackTracon: FallbackTracon[],
    visible: boolean) => {
    const dispatch = useDispatch();

    const matchedIconData = useMemo(() => {
        const data = (!matchedTracon || matchedTracon.length === 0)
            ? []
            : matchedTracon.map((tracon) => {
                if (tracon.traconInfo.coordinates.length > 1) {
                    const lon = tracon.traconInfo.coordinates[0];
                    const lat = tracon.traconInfo.coordinates[1];
                    const name = tracon.traconInfo.name;

                    const traconHoverObj: HoverTracon = {
                        controllers: tracon.controllers,
                        traconInfo: {
                            id: tracon.traconInfo.id,
                            callsignPrefix: tracon.traconInfo.callsignPrefix,
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
        return data;
    }, [matchedTracon]);

    const fallBackIconData = useMemo(() => {
        const data = (!matchedFallbackTracon || matchedFallbackTracon.length === 0)
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
        return data;
    }, [matchedFallbackTracon]);

    const debouncedHover = useCallback(
        debounce((data) => {
            dispatch(setHoveredTracon(data));
        }, 250),
        [dispatch]
    );

    // Clean up the debounce function when the component unmounts
    useEffect(() => {
        return () => {
            debouncedHover.cancel();
        };
    }, [debouncedHover]);

    const getIcon = useCallback((d) => ({
        url: d.iconUrl,
        width: 130,
        height: 50,
        anchorY: 50,
    }), []);


    return useMemo(() => {
        return new IconLayer({
            id: "tracon-icon-layer",
            data: [...matchedIconData, ...fallBackIconData],
            pickable: true,
            visible: visible,
            getPosition: d => d.position,
            getIcon,
            sizeScale: 0.8,
            getSize: () => 28,
            onHover: ({ object }) => {
                if (object) {
                    debouncedHover(object.traconInfo);
                } else {
                    debouncedHover(null);
                }
            },
            updateTriggers: {
                getIcon: {
                    matched: matchedTracon.map((tracon) => tracon.traconInfo.id)
                        .join("-"),
                    fallback: matchedFallbackTracon.map((tracon) => tracon.controllers[0]?.callsign.slice(0, -4))
                        .join("-"),
                },
            },
            // getColor: () => [0, 0, 0, 255],
            // parameters: { depthTest: false }
        });
    }, [matchedTracon, fallBackIconData, visible]);
};

export default useTraconIconLayer;