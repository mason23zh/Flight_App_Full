import { MapRef } from "react-map-gl";
import React from "react";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"

const switchMapStyles = (mapRef: React.RefObject<MapRef>, mapStyle: MapStyle) => {
    if (mapRef.current) {
        const map = mapRef.current.getMap();
        let styleUrl: string;
        switch (mapStyle) {
        case "DEFAULT":
            styleUrl = import.meta.env.VITE_MAPBOX_MAIN_STYLE;
            map.setStyle(styleUrl);
            break;
        case "MONO_LIGHT":
            styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_LIGHT_STYLE;
            map.setStyle(styleUrl);
            break;
        case "MONO_DARK":
            styleUrl = import.meta.env.VITE_MAPBOX_MONOCHROME_DARK_STYLE;
            map.setStyle(styleUrl);
            break;
        case "SATELLITE":
            styleUrl = import.meta.env.VITE_MAPBOX_SATELLITE_STREET_STYLE;
            map.setStyle(styleUrl);
            break;
        default:
            map.setStyle(import.meta.env.VITE_MAPBOX_MAIN_STYLE);
        }
    }
};

export default switchMapStyles;