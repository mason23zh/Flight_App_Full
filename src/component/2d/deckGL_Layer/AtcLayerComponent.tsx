import React, { useCallback, useMemo } from "react";
import { MatchedFir } from "../../../hooks/useMatchedFirs";
import { FallbackTracon, MatchedTracon } from "../../../hooks/useMatchTracon";
import { AirportService, VatsimControllers } from "../../../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { HoverTracon } from "../mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import controllerIconLayer from "./controllerIconLayer";
import firIconLayer from "./firIconLayer";
import traconIconLayer from "./traconIconLayer";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface AtcLayerComponentProps {
    controllerData: VatsimControllers;
    isControllerDataLoading: boolean;
    isControllerDataError: FetchBaseQueryError | SerializedError;
    setHoverControllerIcon: (icon: AirportService | null) => void;
    setHoverTraconIcon: (icon: HoverTracon | null) => void;
    setHoverFirIcon: (icon: MatchedFir | null) => void;
}

const AtcLayerComponent = ({
    controllerData,
    isControllerDataError,
    isControllerDataLoading,
    setHoverControllerIcon,
    setHoverTraconIcon,
    setHoverFirIcon
}: AtcLayerComponentProps) => {
    const {
        matchedFirs,
        isError: errorMatchedFirs
    } = useSelector((state: RootState) => state.matchedFirs);

    const {
        matchedFallbackTracons,
        matchedTracons,
        isLoading: isTraconLoading,
        isError: isTraconError
    } = useSelector((state: RootState) => state.matchedTracons);

    const debouncedSetHoverControllerIcon = useCallback(
        debounce((icon) => {
            setHoverControllerIcon(icon);
        }, 300),
        []
    );

    const debouncedSetMatchedHoverTraconIcon = useCallback(
        debounce((icon) => {
            setHoverTraconIcon(icon);
        }, 300),
        []
    );

    const debouncedSetHoverFirIcon = useCallback(
        debounce((icon) => {
            setHoverFirIcon(icon);
        }, 300),
        []
    );

    const controllerMarkerLayer = useMemo(() =>
        controllerIconLayer(
            controllerData,
            debouncedSetHoverControllerIcon
        ),
    [isControllerDataError, isControllerDataLoading, controllerData]
    );

    const firLabelLayer = useMemo(() =>
        firIconLayer(matchedFirs, debouncedSetHoverFirIcon),
    [matchedFirs, errorMatchedFirs]
    );

    const traconLabelLayer = useMemo(() =>
        traconIconLayer(
            matchedTracons,
            matchedFallbackTracons,
            debouncedSetMatchedHoverTraconIcon,
        ), [matchedFirs, matchedFallbackTracons, isTraconError, isTraconLoading]);

    return [controllerMarkerLayer, traconLabelLayer, firLabelLayer];
};

export default AtcLayerComponent;