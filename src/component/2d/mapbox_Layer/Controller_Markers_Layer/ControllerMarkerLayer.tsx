import React from "react";
import { VatsimControllers } from "../../../../types";
import useRenderControllerMarkers from "../../../../hooks/useRenderControllerMarkers";
import ControllerMarkerPopup from "./ControllerMarkerPopup";

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


    console.log("Controller Hover info:", hoverInfo);

    return (
        <>
            {labelVisible && renderedMarkers}
            {hoverInfo && <ControllerMarkerPopup hoverInfo={hoverInfo}/>}
        </>
    );
};

export default React.memo(ControllerMarkerLayer);