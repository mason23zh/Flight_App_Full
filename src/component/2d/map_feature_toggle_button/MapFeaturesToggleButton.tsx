import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

interface Props {
    onToggle: (activeFlag: boolean) => void;
    icon: React.ReactElement;
    initialActive: boolean;
    tooltipMessage: string;
    isTouchScreen: boolean;
    buttonId: string;
}

const MapFeaturesToggleButton = ({
    onToggle,
    icon,
    initialActive,
    tooltipMessage,
    isTouchScreen,
    buttonId
}: Props) => {
    const iconClass = "text-white text-xl";
    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";
    const [isActive, setIsActive] = useState(initialActive);
    const [activeButtonClass, setActiveButtonClass] = useState(initialActive ? activeClass : inActiveClass);

    // Copy React-Icon
    const styledIcon = React.cloneElement(icon, { "className": iconClass });


    useEffect(() => {
        if (initialActive) {
            setActiveButtonClass(activeClass);
        } else {
            setActiveButtonClass(inActiveClass);
        }
    }, [initialActive]);

    useEffect(() => {
        setActiveButtonClass(isActive ? activeClass : inActiveClass);
        onToggle(isActive);
    }, [isActive]);

    const handleClick = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
    };

    return (
        <div
            className="relative"
        >
            <button
                id={buttonId}
                className={activeButtonClass}
                onClick={handleClick}
            >
                {styledIcon}
            </button>
            {(!isTouchScreen) &&
                <Tooltip
                    anchorSelect={`#${buttonId}`}
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
        </div>
    );
};

export default MapFeaturesToggleButton;