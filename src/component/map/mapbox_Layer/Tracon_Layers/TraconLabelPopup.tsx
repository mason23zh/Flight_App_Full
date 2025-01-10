import React, { useEffect, useRef } from "react";
import { Popup } from "react-map-gl";
import { returnOnlineTime } from "../util/calculateOnlineTime";
import { useTheme } from "../../../../hooks/ThemeContext";
import mapboxgl from "mapbox-gl";
import useIsTouchScreen from "../../../../hooks/useIsTouchScreen";

interface HoverTraconControllers {
    callsign: string;
    name: string;
    frequency: string;
    logon_time: string;
}

export interface HoverTracon {
    controllers: HoverTraconControllers[];
    traconInfo: {
        id?: string;
        callsignPrefix?: string;
        name: string;
        coordinates: number[];
    };
}

interface TraconLabelPopupProps {
    hoverTracon: HoverTracon;
}

const TraconLabelPopup = ({ hoverTracon }: TraconLabelPopupProps) => {
    if (!hoverTracon) return null;

    const darkMode = useTheme();
    const popupRef = useRef<mapboxgl.Popup | null>(null);
    const lon = hoverTracon.traconInfo?.coordinates[0];
    const lat = hoverTracon.traconInfo?.coordinates[1];
    const traconName = hoverTracon.traconInfo?.name;
    const isTouchScreen = useIsTouchScreen();

    useEffect(() => {
        if (popupRef.current) {
            popupRef.current.setOffset([0, -20]);
        }
    }, [popupRef.current]);

    const colorTheme = darkMode ? "bg-gray-500 text-gray-200" : "bg-gray-200 text-gray-700";
    const freqThemeColor = darkMode ? "text-green-400" : "text-blue-600";

    const renderControllersData = hoverTracon?.controllers.map((c) => {
        const uniqueKey = c.name + c.callsign;
        const {
            hour,
            minute
        } = returnOnlineTime(c.logon_time);

        return (
            <div key={uniqueKey} className="flex items-center text-center gap-2 px-2 py-1 w-fit">
                <div className="">
                    {c.callsign}
                </div>
                <div className="">
                    {c.name}
                </div>
                <div className={`font-bold ${freqThemeColor}`}>
                    {c.frequency}
                </div>
                <div className="">
                    {hour}:{minute}
                </div>
            </div>
        );
    });

    return (
        <Popup
            ref={popupRef}
            longitude={lon}
            latitude={lat}
            style={{ zIndex: 100 }}
            closeButton={false}
            maxWidth={isTouchScreen ? "380px" : "500px"}
            anchor={isTouchScreen ? "bottom" : undefined}
        >
            <div className={`grid grid-cols-1 justify-center items-center
            gap-1 p-1 sm:p-2 w-full rounded-lg ${colorTheme}`}
            >
                <div className="flex text-center gap-3 justify-self-start w-max">
                    <div className="text-sm font-bold">
                        {traconName}
                    </div>
                </div>

                <div className="w-full">
                    {renderControllersData}
                </div>
            </div>
        </Popup>
    );
};

export default TraconLabelPopup;