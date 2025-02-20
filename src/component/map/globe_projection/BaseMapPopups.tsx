import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import FirLabelPopup from "../mapbox_Layer/FIR_Layers/FirLabelPopup";
import TraconLabelPopup from "../mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import ControllerMarkerPopup from "../mapbox_Layer/Controller_Markers_Layer/ControllerMarkerPopup";

const BaseMapPopups = () => {
    const { hoveredFir } = useSelector((state: RootState) => state.matchedFirs);
    const { hoveredTracon } = useSelector((state: RootState) => state.matchedTracons);
    const { hoveredController } = useSelector((state: RootState) => state.matchedControllers);

    return (
        <>
            {hoveredFir && <FirLabelPopup hoverFir={hoveredFir}/>}
            {hoveredTracon && <TraconLabelPopup hoverTracon={hoveredTracon}/>}
            {hoveredController && <ControllerMarkerPopup hoverInfo={hoveredController}/>}
        </>
    );
};

export default BaseMapPopups;