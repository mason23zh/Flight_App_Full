import { useEffect } from "react";
import { useMap } from "react-map-gl";

type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE";

const styleMap: Record<MapStyle, string> = {
    DEFAULT: import.meta.env.VITE_MAPBOX_MAIN_STYLE,
    MONO_LIGHT: import.meta.env.VITE_MAPBOX_MONOCHROME_LIGHT_STYLE,
    MONO_DARK: import.meta.env.VITE_MAPBOX_MONOCHROME_DARK_STYLE,
    SATELLITE: import.meta.env.VITE_MAPBOX_SATELLITE_STREET_STYLE,
};

const useMapStyleSync = (styleName: MapStyle) => {
    const { current: mapRef } = useMap();
    useEffect(() => {
        const map = mapRef?.getMap();
        if (!map) return;

        const targetStyleUrl = styleMap[styleName];
        const currentStyleUrl = map.getStyle()?.sprite || "";

        if (!currentStyleUrl.includes(targetStyleUrl)) {
            map.setStyle(targetStyleUrl);
        }
    }, [mapRef, styleName]);
};

export default useMapStyleSync;