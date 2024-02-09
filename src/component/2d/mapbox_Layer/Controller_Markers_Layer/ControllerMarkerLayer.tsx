import React from "react";
import { VatsimControllers } from "../../../../types";
import useRenderControllerMarkers from "../../../../hooks/useRenderControllerMarkers";
import ControllerMarkerPopup from "./ControllerMarkerPopup";
import { isAirportService } from "../util/helpers";

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
            {labelVisible && renderedMarkers}
            {hoverInfo && isAirportService(hoverInfo) &&
                <ControllerMarkerPopup hoverInfo={hoverInfo}/>
            }
        </>
    );
};

export default React.memo(ControllerMarkerLayer);