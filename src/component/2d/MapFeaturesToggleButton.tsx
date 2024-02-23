import React, { useState } from "react";

interface Props {
    onToggle: (activeFlag: boolean) => void;
    icon: React.ReactElement;
    initialActive: boolean;
}

const MapFeaturesToggleButton = ({
    onToggle,
    icon,
    initialActive = false
}: Props) => {
    const iconClass = "text-white text-xl";
    const activeClass = "bg-gray-400 px-2 py-1 items-center rounded-lg hover:bg-gray-500";
    const inActiveClass = "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";
    const [isActive, setIsActive] = useState(initialActive);
    const [activeButtonClass, setActiveButtonClass] = useState(initialActive ? activeClass : inActiveClass);

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

    return (
        <button
            className={activeButtonClass}
            onClick={handleClick}
        >
            {styledIcon}
        </button>
    );
};

export default MapFeaturesToggleButton;