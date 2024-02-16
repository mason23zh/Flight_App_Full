import React from "react";
import { Button, ButtonGroup } from "rsuite";
import { MapRef } from "react-map-gl";

interface Props {
    mapRef: React.RefObject<MapRef>;
}

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE"


const MapStyleToggleButtonGroup = ({ mapRef }: Props) => {
    const setMapStyle = (mapName: MapStyle) => {
        if (mapRef.current) {
            const map = mapRef.current.getMap();
            let styleUrl: string;
            switch (mapName) {
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


    return (
        <ButtonGroup block={true} vertical={true}>
            <Button onClick={() => setMapStyle("DEFAULT")}>Normal</Button>
            <Button onClick={() => setMapStyle("MONO_LIGHT")}>Mono light</Button>
            <Button onClick={() => setMapStyle("MONO_DARK")}>MONO dark</Button>
            <Button onClick={() => setMapStyle("SATELLITE")}>Sat</Button>
        </ButtonGroup>
    );
};

export default MapStyleToggleButtonGroup;