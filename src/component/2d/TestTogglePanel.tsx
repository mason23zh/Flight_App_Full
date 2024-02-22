import React from "react";
import MapFeaturesToggleButton from "./MapFeaturesToggleButton";
import { useDispatch } from "react-redux";
import { toggleTrafficLayer } from "../../store";
import { IoAirplane } from "react-icons/io5";


const TestTogglePanel = () => {
    const dispatch = useDispatch();

    return (
        <div className="z-100 absolute top-50 right-50">
            <MapFeaturesToggleButton
                onToggle={(active) => dispatch(toggleTrafficLayer(active))}
                icon={<IoAirplane/>}
            />
        </div>
    );
};

export default TestTogglePanel;