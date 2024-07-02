/*
* This layer will be responsible for rendering local user traffic
* This data for the local user traffic will come from simconnector server
* */
import React from "react";
import DeckGlOverlay from "../deckGL_Layer/DeckGLOverlay";
import useIsTouchScreen from "../../../hooks/useIsTouchScreen";
import renderLocalTrackFlightLayer from "../renderLocalTrackFlightLayer";

interface FlightData {
    latitude: number | null;
    longitude: number | null;
    heading: number | null;
    groundspeed: number | null;
    altitude: number | null;
}

interface LocalUserTrafficLayerProps {
    liveTrafficData: FlightData;
}

const LocalUserTrafficLayer = ({ liveTrafficData }: LocalUserTrafficLayerProps) => {
    const isTouchScreen = useIsTouchScreen();
    const localTrackFlightLayer = renderLocalTrackFlightLayer(liveTrafficData);

    return (
        <DeckGlOverlay
            interleaved={false}
            // onClick={(info: PickedTraffic) => deckOnClick(info)}
            layers={[localTrackFlightLayer]}
            pickingRadius={10}

            getTooltip={isTouchScreen ? undefined : ({ object }) => {
                if (object) {
                    const bgColor = "rgba(39, 40, 45, 0.9)";
                    return {
                        text: object && `${object.callsign}
                                      ${object?.flight_plan?.departure || "N/A"} - ${object?.flight_plan?.arrival
                                || "N/A"}`,
                        style: {
                            fontStyle: "bold",
                            width: "auto",
                            height: "50px",
                            padding: "4px",
                            borderRadius: "10px",
                            textAlign: "center",
                            backgroundColor: bgColor,
                            color: "white",
                            marginLeft: "15px",
                            marginBottom: "5px",
                            zIndex: "100",
                        }
                    };
                }
            }}
            // onHover={({ object }) => (isHovering = Boolean(object))}
            // getCursor={({ isDragging }) => (isDragging ? "auto" : (isHovering ? "pointer" : "grab"))}
        />
    );
};

export default LocalUserTrafficLayer;