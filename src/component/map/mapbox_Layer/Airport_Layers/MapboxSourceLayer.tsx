import { Source } from "react-map-gl";

const MapboxSourceLayer = ({ children }) => {
    return (
        <Source
            id="gns-430-source"
            url={import.meta.env.VITE_MAPBOX_AIRPORT_LAYER_URL}
            type="vector"
            maxzoom={14}
        >
            {children}
        </Source>
    );
};

export default MapboxSourceLayer;
