import React, { useEffect, useState } from "react";
import { Toggle } from "rsuite";
import switchMapStyles from "./switchMapStyles";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"
const ToggleMapStyle = ({ mapRef }) => {
    const [mapStyle, setMapStyle] = useState<MapStyle>("DEFAULT");
    useEffect(() => {
        switchMapStyles(mapRef, mapStyle);
    }, [mapStyle]);
    return (
        <div>
            <Toggle onChange={() => setMapStyle("SATELLITE")}>Sat</Toggle>
            <Toggle onChange={() => setMapStyle("MONO_DARK")}>Dark</Toggle>
            <Toggle onChange={() => setMapStyle("MONO_LIGHT")}>Light</Toggle>
            <Toggle onChange={() => setMapStyle("DEFAULT")}>Default</Toggle>
        </div>
    );
};

export default ToggleMapStyle;