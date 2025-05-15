import TelemetryElement from "./TelemetryElement";
import { useWebSocketContext } from "../WebSocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const TelemetryPanel = () => {
    const {
        flightData,
        liveTrafficAvailable
    } = useWebSocketContext();

    const {
        displayTelemetry,
        movingMap
    } = useSelector((state: RootState) => state.vatsimMapVisible);

    if (!flightData || !liveTrafficAvailable || !movingMap) return null;


    return (
        <div className={`w-auto z-[200] absolute top-[5%] 
        right-5 grid grid-rows-1 
        bg-gray-700 p-2 gap-2 rounded-lg 
        transform transition-all duration-300 ease-in-out
        ${displayTelemetry ? "transition-x-0 opacity-100" : "translate-x-5 opacity-0"}
        `}>
            <TelemetryElement
                telemetryName="Indicated Airpseed (IAS)"
                telemetryData={Math.round(flightData.indicated_airspeed)}
                telemetryUnit="Kt"
            />

            <TelemetryElement
                telemetryName="Groundspeed"
                telemetryData={Math.round(flightData.groundspeed)}
                telemetryUnit="Kt"
            />

            <TelemetryElement
                telemetryName="MSL Altitude"
                telemetryData={Math.round(flightData.MSL)}
                telemetryUnit="ft"
            />

            <TelemetryElement
                telemetryName="AGL Altitude"
                telemetryData={Math.round(flightData.AGL)}
                telemetryUnit="ft"
            />

            <TelemetryElement
                telemetryName="Magnetic Heading"
                telemetryData={Math.round(flightData.heading)}
                telemetryUnit="&deg;"
            />

            <TelemetryElement
                telemetryName="True Heading"
                telemetryData={Math.round(flightData.true_heading)}
                telemetryUnit="&deg;"
            />

            <TelemetryElement
                telemetryName="Vertical Speed"
                telemetryData={Math.round(flightData.vertical_speed)}
                telemetryUnit="ft/m"
            />

            <TelemetryElement
                telemetryName="Bank Angle"
                telemetryData={Math.abs(Math.round(flightData.roll))}
                telemetryUnit="&deg;"
            />

            <TelemetryElement
                telemetryName="Pitch Atitude"
                telemetryData={Math.round(flightData.pitch)}
                telemetryUnit="&deg;"
            />
        </div>
    );
};

export default TelemetryPanel;