import React, { useState } from "react";

const MapFeaturesToggleButton = ({
    onToggle,
    icon,
    initialActive = false
}) => {
    const [isActive, setIsActive] = useState(initialActive);

    const activeClass = "px-2 bg-green hover:text-large";
    const inActiveClass = "px-2 bg-red";

    const styledIcon = React.cloneElement(icon, { "className": "bg-green-600 text-white hover:bg-red-600" });


    const handleClick = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        if (onToggle) {
            onToggle(newActiveState);
        }
    };

    return (
        <button
            className={isActive ? activeClass : inActiveClass}
            onClick={handleClick}
        >
            {styledIcon}
        </button>
    );
};

export default MapFeaturesToggleButton;