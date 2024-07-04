import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, FC } from "react";
import { LiveFlightData } from "../../types";
import { setLiveTrafficAvailable } from "../../store";

interface WebSocketContextProps {
    flightData: LiveFlightData;
    liveTrafficAvailable: boolean;
    openWebSocket: () => void;
    closeWebSocket: () => void;
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
    const wsRef = useRef<WebSocket | null>(null);

    const openWebSocket = () => {
        wsRef.current = new WebSocket("ws://localhost:6789");

        wsRef.current.onmessage = (event) => {
            const data: LiveFlightData = JSON.parse(event.data);
            setLiveTrafficAvailable(true);
            setLiveTrafficAvailableLocal(true);
            setFlightData(data);
        };

        wsRef.current.onerror = () => {
            setLiveTrafficAvailable(false);
            setLiveTrafficAvailableLocal(false);
        };
    };

    const closeWebSocket = () => {
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
            closeWebSocket
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};