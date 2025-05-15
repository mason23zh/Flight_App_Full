/* eslint-disable global-require */
import {
    MapContainer, Marker, Popup, TileLayer,
} from "react-leaflet";
import L from "leaflet";
import { useTheme } from "../hooks/ThemeContext";
import iconImg from "leaflet/dist/images/marker-icon.png";
import retainIcon from "leaflet/dist/images/marker-icon-2x.png";
import shadowIcon from "leaflet/dist/images/marker-shadow.png";

function AirportMap({
    lat,
    lng,
    name,
}) {
    const darkMode = useTheme();
    const tileLayer = darkMode
        ? (
            <TileLayer
                id="mapbox/dark-v10"
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
        )
        : (
            <TileLayer
                id="mapbox/dark-v10"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        );

    const icon = L.icon({
        iconUrl: iconImg,
        shadowUrl: shadowIcon,
        iconRetinaUrl: retainIcon,
    });

    return (
        <div className="h-[300px] w-[1200px] max-w-[1200px]">
            <MapContainer
                style={{
                    height: "100%",
                    minHeight: "100%"
                }}
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
            >
                {tileLayer}
                <Marker position={[lat, lng]} icon={icon}>
                    <Popup>
                        {name}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default AirportMap;
