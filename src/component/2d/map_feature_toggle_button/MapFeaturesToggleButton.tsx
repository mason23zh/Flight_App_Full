import React, { useEffect, useState } from "react";
import useDisplayTooltip from "../../../hooks/useDisplayTooltip";

interface Props {
    onToggle: (activeFlag: boolean) => void;
    icon: React.ReactElement;
    initialActive: boolean;
    tooltipMessage: string;
    isTouchScreen: boolean;
}

const MapFeaturesToggleButton = ({
    onToggle,
    icon,
    initialActive = false,
    tooltipMessage,
    isTouchScreen
}: Props) => {
    const iconClass = "text-white text-xl";
    const activeClass = isTouchScreen ?
        "bg-gray-400 px-2 py-1 items-center rounded-lg" :
        "bg-gray-400 px-2 py-1 items-center rounded-lg hover:bg-gray-500";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";
    const [isActive, setIsActive] = useState(initialActive);
    const [activeButtonClass, setActiveButtonClass] = useState(initialActive ? activeClass : inActiveClass);
    const [buttonClick, setButtonClick] = useState(false);


    // Copy React-Icon
    const styledIcon = React.cloneElement(icon, { "className": iconClass });

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
        tooltipVisible,
        resetTooltip,
        mousePosition
    } = useDisplayTooltip(400);

    useEffect(() => {
        setActiveButtonClass(isActive ? activeClass : inActiveClass);
        onToggle(isActive);

    }, [isActive]);

    const handleClick = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        setButtonClick(true);
        resetTooltip();
    };

    useEffect(() => {
        if (buttonClick) {
            resetTooltip();
            setButtonClick(false);
        }
    }, [tooltipVisible, buttonClick, tooltipVisible]);


    const tooltipStyle = "fixed px-2 py-1 bg-black text-white " +
            "text-xs rounded-md pointer-events-none z-40";
    return (
        <div
            className="relative"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
        >
            <button
                className={activeButtonClass}
                onClick={handleClick}
            >
                {styledIcon}
            </button>
            {(tooltipVisible && !isTouchScreen && !buttonClick) &&
                <div
                    className={tooltipStyle}
                    style={{
                        top: mousePosition.y + 15,
                        left: mousePosition.x + 15,
                    }}
                >
                    {tooltipMessage}
                </div>
            }
        </div>
    );
};

export default MapFeaturesToggleButton;