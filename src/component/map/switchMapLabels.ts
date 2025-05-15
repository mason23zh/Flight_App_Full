import mapboxgl from "mapbox-gl";

const switchMapLabels = (map: mapboxgl.Map, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (map) {
        // const map = mapRef.current.getMap();
        const layers = [
            "continent-label", "country-label", "state-label",
            "settlement-major-label", "settlement-minor-label",
            "settlement-subdivision-label"
        ];

        layers.forEach(layer => {
            try {
                map.setLayoutProperty(layer, "visibility", flag);
            } catch (e) {
                console.error(`Error setting visibility for ${layer}`, e);
            }
        });
    } else {
        console.warn("Error swtiching map label");
    }
};

export default switchMapLabels;