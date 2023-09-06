/* eslint-disable global-require */
import React from "react";
import {
    MapContainer, Marker, Popup, TileLayer,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function AirportMap({
    lat, lng, name,
}) {
    return (
        <div className="h-[300px] w-[1200px] max-w-[1200px]">
            <MapContainer
                style={{ height: "100%", minHeight: "100%" }}
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={false}
            >
                <TileLayer
                    id="mapbox/dark-v10"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {name}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default AirportMap;
