import { useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { setHoveredFir } from "../store";
import generateFirIcon from "../component/2d/mapbox_Layer/util/generateFirIcon";
import { IconLayer } from "@deck.gl/layers/typed";
import { MatchedFir } from "./useMatchedFirs";

const useFirIconLayer = (matchedFirs: MatchedFir[], visible: boolean) => {
    const dispatch = useDispatch();

    // Debounce hover state updates
    const debouncedHover = useCallback(
        debounce((data) => {
            dispatch(setHoveredFir(data));
        }, 250),
        [dispatch]
    );

    // Clean up the debounce function when the component unmounts
    useEffect(() => {
        return () => {
            debouncedHover.cancel();
        };
    }, [debouncedHover]);

    // Memoize data processing for the layer
    const iconData = useMemo(() => {
        if (!matchedFirs) return [];
        return matchedFirs.map((feature) => {
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
    }, [matchedFirs]);

    const getIcon = useCallback((d) => ({
        url: d.iconUrl,
        width: 160,
        height: 70,
        anchorY: 70,
    }), []);

    return useMemo(() => {
        return new IconLayer({
            id: "fir-icon-layer",
            data: iconData,
            pickable: true,
            visible,
            getPosition: (d) => d.position,
            getIcon,
            sizeScale: 1,
            getSize: () => 30,
            onHover: ({ object }) => {
                if (object) {
                    debouncedHover(object.firInfo);
                } else {
                    debouncedHover(null);
                }
            },
            parameters: { depthTest: false },
            updateTriggers: {
                getIcon: matchedFirs.map(fir => fir.firInfo.firBoundary)
                    .join("-")
            },
        });
    }, [matchedFirs, visible]);
};

export default useFirIconLayer;