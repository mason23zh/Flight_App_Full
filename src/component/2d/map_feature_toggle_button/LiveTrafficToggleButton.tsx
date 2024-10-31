import React, { useState, useEffect } from "react";
import { MdNavigation } from "react-icons/md"; // Use any icon you prefer
import { useWebSocketContext } from "../WebSocketContext";
import { useDispatch } from "react-redux";
import { toggleMovingMap } from "../../../store";
import { Tooltip } from "react-tooltip";
import CustomLiveTrafficErrorNotification from "./CustomLiveTrafficErrorNotification";

interface Props {
    isTouchScreen: boolean;
}

const LiveTrafficToggleButton = ({ isTouchScreen }: Props) => {
    const {
        openWebSocket,
        closeWebSocket,
        connectionStatus
    } = useWebSocketContext();
    const [isActive, setIsActive] = useState(false); // Track button's active state
    const [showNotification, setShowNotification] = useState(false);
    const [webSocketConnected, setWebSocketConnected] = useState(false);
    const dispatch = useDispatch();

    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";

    const tooltipMessage = "Enable moving map";

    const handleToggle = () => {
        const localActiveState = !isActive;
        setIsActive(prev => !prev);
        setWebSocketConnected(localActiveState);
        if (localActiveState) {
            openWebSocket();
        } else {
            closeWebSocket();
        }
    };


    useEffect(() => {
        if (!isActive) {
            closeWebSocket();
        }

        if (connectionStatus === "failed") {
            setShowNotification(true);
        }

        if ((connectionStatus === "disconnected" || connectionStatus === "failed") && webSocketConnected) {
            closeWebSocket(); // Close WebSocket if it's disconnected or failed
            setIsActive(false); // Deactivate button
            setWebSocketConnected(false); // Reset WebSocket connected state
            dispatch(toggleMovingMap(false)); // Disable moving map
        }

        // if (connectionStatus === "disconnected" || connectionStatus === "failed") {
        //     closeWebSocket();
        //     setIsActive(false);
        //     dispatch(toggleMovingMap(false));
        // }

        if (connectionStatus === "connected" && isActive) {
            dispatch(toggleMovingMap(true));
        }
    }, [connectionStatus, dispatch, closeWebSocket, webSocketConnected, isActive]);

    return (
        <div
            className="relative"
            onClick={handleToggle}
        >
            <button
                id="nav-button"
                className={isActive ? activeClass : inActiveClass}
            >
                <MdNavigation className="text-xl text-white"/>
            </button>

            {!isTouchScreen &&
                <Tooltip
                    anchorSelect="#nav-button"
                    delayShow={300}
                    style={{
                        backgroundColor: "rgb(0,0,0)",
                        color: "rgb(255,255,255)",
                        fontSize: "13px",
                        padding: "5px",
                        borderRadius: "5px"
                    }}
                >
                    {tooltipMessage}
                </Tooltip>
            }
            {
                showNotification &&
                <CustomLiveTrafficErrorNotification
                    onAutoClose={() => setShowNotification(false)}
                    onManualClose={() => setShowNotification(false)}
                    autoCloseTime={6000}
                />
            }
        </div>
    );
};

export default React.memo(LiveTrafficToggleButton);