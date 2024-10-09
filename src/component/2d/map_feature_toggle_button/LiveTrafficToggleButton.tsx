import React, { useState, useEffect } from "react";
import { MdNavigation } from "react-icons/md"; // Use any icon you prefer
import { useWebSocketContext } from "../WebSocketContext";
import { useDispatch } from "react-redux";
import { toggleMovingMap } from "../../../store";

interface Props {
    isTouchScreen: boolean;
}

const LiveTrafficToggleButton = ({ isTouchScreen }: Props) => {
    //TODO: Handle websocket connection lost
    const {
        openWebSocket,
        closeWebSocket,
        connectionStatus
    } = useWebSocketContext();
    const [isActive, setIsActive] = useState(false); // Track button's active state
    const dispatch = useDispatch();

    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";


    const handleToggle = () => {
        const localActiveState = !isActive;
        setIsActive(prev => !prev);
        if (localActiveState) {
            openWebSocket();
        } else {
            closeWebSocket();
        }
    };

    useEffect(() => {
        if (connectionStatus === "disconnected" || connectionStatus === "failed") {
            closeWebSocket();
            setIsActive(false);
            dispatch(toggleMovingMap(false));
        }

        if (connectionStatus === "connected" && isActive) {
            dispatch(toggleMovingMap(true));
        }
    }, [connectionStatus]);

    return (
        <div
            className="relative"
            onClick={handleToggle}
        >
            <button
                className={isActive ? activeClass : inActiveClass}
            >
                <MdNavigation className="text-xl"/>
            </button>

        </div>
    );
};

export default LiveTrafficToggleButton;