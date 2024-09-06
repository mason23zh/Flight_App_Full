import React, { useMemo } from "react";
import { AirportService, VatsimControllers } from "../../../../types";
import useRenderControllerMarkers from "../../../../hooks/useRenderControllerMarkers";
import ControllerMarkerPopup from "./ControllerMarkerPopup";
import { isAirportService } from "../util/helpers";

interface Controller {
    controllerInfo: VatsimControllers;
    labelVisible: boolean;
}

const ControllerMarkerLayer = ({
    controllerInfo,
    labelVisible,
}: Controller) => {
    const {
        renderedMarkers,
        hoverInfo
    } = useRenderControllerMarkers(controllerInfo);

    const hoverInfoCast = hoverInfo as AirportService; //cast

    return (
        <>
            {labelVisible && renderedMarkers}
            {/* {hoverInfo && isAirportService(hoverInfoCast) && */}
            {/*     <ControllerMarkerPopup hoverInfo={hoverInfoCast}/> */}
            {/* } */}
        </>
    );
};

export default React.memo(ControllerMarkerLayer);