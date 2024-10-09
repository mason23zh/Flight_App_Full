import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, FC } from "react";
import { LiveFlightData } from "../../types";
import { setLiveTrafficAvailable } from "../../store";

interface WebSocketContextProps {
    flightData: LiveFlightData;
    liveTrafficAvailable: boolean;
    openWebSocket: () => void;
    closeWebSocket: () => void;
    connectionStatus: "connected" | "disconnected" | "connecting" | "failed";
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("WebSocket context not available");
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
    const [flightData, setFlightData] = useState<LiveFlightData>({
        latitude: null,
        longitude: null,
        heading: null,
        groundspeed: null,
        MSL: null,
    });

    const [liveTrafficAvailable, setLiveTrafficAvailableLocal] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting" | "failed">("disconnected");
    const wsRef = useRef<WebSocket | null>(null);

    const openWebSocket = () => {
        console.log("Open web socket.");
        setConnectionStatus("connecting");
        wsRef.current = new WebSocket("ws://localhost:49153");

        wsRef.current.onopen = () => {
            console.log("WebSocket connection established.");
            setConnectionStatus("connected");
        };

        wsRef.current.onmessage = (event) => {
            const data: LiveFlightData = JSON.parse(event.data);
            setLiveTrafficAvailable(true);
            setLiveTrafficAvailableLocal(true);
            setFlightData(data);
        };

        wsRef.current.onerror = () => {
            console.log("WebSocket connection error.");
            setLiveTrafficAvailable(false);
            setLiveTrafficAvailableLocal(false);
            setConnectionStatus("failed");
        };

        // wsRef.current.onclose = () => {
        //     console.log("WebSocket connection close");
        //     setConnectionStatus("disconnected");
        //     setLiveTrafficAvailableLocal(false);
        // };
    };

    const closeWebSocket = () => {
        console.log("close web socket.");
        if (wsRef.current) {
            wsRef.current.close();
        }
    };

    useEffect(() => {
        openWebSocket();

        return () => {
            closeWebSocket();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{
            flightData,
            liveTrafficAvailable,
            openWebSocket,
            closeWebSocket,
            connectionStatus
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};