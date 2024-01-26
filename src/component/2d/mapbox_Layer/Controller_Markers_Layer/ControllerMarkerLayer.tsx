import React from "react";
import { VatsimControllers } from "../../../../types";
import useRenderControllerMarkers from "../../../../hooks/useRenderControllerMarkers";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const ControllerMarkerLayer = ({
    controllerInfo,
    labelVisible
}: Controller) => {
    const {
        renderedMarkers,
        hoverInfo
    } = useRenderControllerMarkers(controllerInfo);


    return (
        <>
            {renderedMarkers}
        </>
    );
};

export default React.memo(ControllerMarkerLayer);