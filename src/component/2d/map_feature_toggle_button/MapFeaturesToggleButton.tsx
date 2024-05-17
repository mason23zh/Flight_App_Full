import React, { useRef, useState } from "react";

interface Props {
    onToggle: (activeFlag: boolean) => void;
    icon: React.ReactElement;
    initialActive: boolean;
    tooltipMessage: string;
}

const MapFeaturesToggleButton = ({
    onToggle,
    icon,
    initialActive = false,
    tooltipMessage
}: Props) => {
    const iconClass = "text-white text-xl";
    const activeClass = "bg-gray-400 px-2 py-1 items-center rounded-lg hover:bg-gray-500";
    const inActiveClass = "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";
    const [isActive, setIsActive] = useState(initialActive);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [activeButtonClass, setActiveButtonClass] = useState(initialActive ? activeClass : inActiveClass);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0
    });


    // Copy React-Icon
    const styledIcon = React.cloneElement(icon, { "className": iconClass });


    const handleClick = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        if (newActiveState) {
            setActiveButtonClass(activeClass);
        } else {
            setActiveButtonClass(inActiveClass);
        }
        if (onToggle) {
            onToggle(newActiveState);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };
    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setTooltipVisible(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setTooltipVisible(false);
    };

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
            {tooltipVisible &&
                <div
                    className="fixed px-2 py-1 bg-black text-white
                        text-xs rounded-md pointer-events-none z-40"
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