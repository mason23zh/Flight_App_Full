import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import FirLabelPopup from "../mapbox_Layer/FIR_Layers/FirLabelPopup";
import TraconLabelPopup from "../mapbox_Layer/Tracon_Layers/TraconLabelPopup";
import ControllerMarkerPopup from "../mapbox_Layer/Controller_Markers_Layer/ControllerMarkerPopup";
import { Popup } from "react-map-gl";
import HoveredTrafficTooltip from "../HoveredTrafficTooltip";
import HoveredTooltip from "../map_feature_toggle_button/HoveredTooltip";
import mapboxgl from "mapbox-gl";
import { popup } from "leaflet";

const BaseMapPopups = () => {
    const { hoveredFir } = useSelector((state: RootState) => state.matchedFirs);
    const { hoveredTracon } = useSelector((state: RootState) => state.matchedTracons);
    const { hoveredController } = useSelector((state: RootState) => state.matchedControllers);
    const { hoveredTraffic } = useSelector((state: RootState) => state.mapLayerHover);

    const popupRef = useRef<mapboxgl.Popup>();

    useEffect(() => {
        popupRef.current?.trackPointer();
        popupRef.current?.addClassName("p-0");
    }, [popupRef.current, hoveredTraffic]);


    return (
        <>
            {hoveredFir && <FirLabelPopup hoverFir={hoveredFir}/>}
            {hoveredTracon && <TraconLabelPopup hoverTracon={hoveredTracon}/>}
            {hoveredController && <ControllerMarkerPopup hoverInfo={hoveredController}/>}
            {(hoveredTraffic && hoveredTraffic.info) && (
                <Popup
                    closeButton={false}
                    ref={popupRef}
                    longitude={hoveredTraffic.info.longitude}
                    latitude={hoveredTraffic.info.latitude}
                    anchor="top-left"
                    offset={-18}
                >
                    <div>
                        <HoveredTrafficTooltip info={hoveredTraffic.info}/>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default BaseMapPopups;