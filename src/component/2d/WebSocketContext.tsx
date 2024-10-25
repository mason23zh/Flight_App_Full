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

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "failed";


export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
    const [flightData, setFlightData] = useState<LiveFlightData>({
        latitude: null,
        longitude: null,
        heading: null,
        groundspeed: null,
        MSL: null,
    });

    const hasErrorOccurred = useRef(false);
    const [liveTrafficAvailable, setLiveTrafficAvailableLocal] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const wsRef = useRef<WebSocket | null>(null);
    const openWebSocket = () => {
        console.log("open Web socket.");
        setConnectionStatus("connecting");
        wsRef.current = new WebSocket("ws://localhost:49153");

        wsRef.current.onopen = () => {
            setConnectionStatus("connected");
        };

        wsRef.current.onmessage = (event) => {
            const data: LiveFlightData = JSON.parse(event.data);
            setLiveTrafficAvailable(true);
            setLiveTrafficAvailableLocal(true);
            setFlightData(data);
        };

        wsRef.current.onerror = () => {
            hasErrorOccurred.current = true;
            setLiveTrafficAvailable(false);
            setLiveTrafficAvailableLocal(false);
            setConnectionStatus("failed");
        };

        wsRef.current.onclose = () => {
            // only set connection status if no error occurred, this will prevent disconnected
            // status override the failed status
            if (!hasErrorOccurred.current) {
                setConnectionStatus("disconnected");
            }
            setLiveTrafficAvailableLocal(false);
        };
    };

    const closeWebSocket = () => {
        if (wsRef.current) {
            wsRef.current.close();
            setConnectionStatus("disconnected");
        }
    };

    //clean up the WebSocket
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
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