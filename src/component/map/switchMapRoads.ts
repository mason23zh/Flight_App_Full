import mapboxgl from "mapbox-gl";

type StyleName = "outdoor-base-v1" | "Monochrome-dark" | "Satellite Streets" | "Monochrome-light";

const switchMapRoads = (map: mapboxgl.Map, visibility: boolean) => {
    const flag = visibility ? "visible" : "none";
    if (map) {
        // const map = mapRef.current.getMap();
        const currentMapStyle = map.getStyle().name as StyleName;
        if (currentMapStyle === "outdoor-base-v1") {
            map.setLayoutProperty("tunnel-major-link", "visibility", flag);
            map.setLayoutProperty("tunnel-street-case", "visibility", flag);
            map.setLayoutProperty("tunnel-primary", "visibility", flag);
            map.setLayoutProperty("tunnel-motorway-trunk", "visibility", flag);
            map.setLayoutProperty("bridge-minor-case", "visibility", flag);
            map.setLayoutProperty("bridge-street-case", "visibility", flag);
            map.setLayoutProperty("bridge-primary-case", "visibility", flag);
            map.setLayoutProperty("bridge-motorway-trunk-case", "visibility", flag);
            map.setLayoutProperty("bridge-major-link-case", "visibility", flag);
            map.setLayoutProperty("road-construction", "visibility", flag);
            map.setLayoutProperty("road-exit-shield", "visibility", flag);
            map.setLayoutProperty("road-intersection", "visibility", flag);
            map.setLayoutProperty("road-label", "visibility", flag);
            map.setLayoutProperty("road-major-link", "visibility", flag);
            map.setLayoutProperty("road-major-link-case", "visibility", flag);
            map.setLayoutProperty("road-minor", "visibility", flag);
            map.setLayoutProperty("road-minor-case", "visibility", flag);
            map.setLayoutProperty("road-minor-link", "visibility", flag);
            map.setLayoutProperty("road-minor-link-case", "visibility", flag);
            map.setLayoutProperty("road-motorway-trunk", "visibility", flag);
            map.setLayoutProperty("road-motorway-trunk-case", "visibility", flag);
            map.setLayoutProperty("road-primary", "visibility", flag);
        } else if (
            currentMapStyle === "Monochrome-dark" ||
            currentMapStyle === "Monochrome-light"
        ) {
            map.setLayoutProperty("road-label-simple", "visibility", flag);
            map.setLayoutProperty("road-path", "visibility", flag);
            map.setLayoutProperty("road-path-cycleway-piste", "visibility", flag);
            map.setLayoutProperty("road-path-trail", "visibility", flag);
            map.setLayoutProperty("road-rail", "visibility", flag);
            map.setLayoutProperty("road-rail-tracks", "visibility", flag);
            map.setLayoutProperty("road-simple", "visibility", flag);
            map.setLayoutProperty("road-steps", "visibility", flag);
        } else if (currentMapStyle === "Satellite Streets") {
            map.setLayoutProperty("road-intersection", "visibility", flag);
            map.setLayoutProperty("road-label", "visibility", flag);
            map.setLayoutProperty("road-major-link", "visibility", flag);
            map.setLayoutProperty("road-major-link-case", "visibility", flag);
            map.setLayoutProperty("road-minor", "visibility", flag);
            map.setLayoutProperty("road-minor-case", "visibility", flag);
            map.setLayoutProperty("road-minor-link", "visibility", flag);
            map.setLayoutProperty("road-minor-link-case", "visibility", flag);
            map.setLayoutProperty("road-motorway-trunk", "visibility", flag);
            map.setLayoutProperty("road-motorway-trunk-case", "visibility", flag);
            map.setLayoutProperty("road-path", "visibility", flag);
            map.setLayoutProperty("road-primary", "visibility", flag);
            map.setLayoutProperty("road-primary-case", "visibility", flag);
            map.setLayoutProperty("road-street", "visibility", flag);
            map.setLayoutProperty("road-street-case", "visibility", flag);
            map.setLayoutProperty("road-street-low", "visibility", flag);
        }
    }
};

export default switchMapRoads;
