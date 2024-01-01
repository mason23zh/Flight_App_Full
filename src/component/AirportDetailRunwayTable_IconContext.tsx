/**
 * This component will render Runway table's wind component
 * in AirportDetail component
 * * */
import React, { useMemo } from "react";
import { IconContext } from "react-icons";
 
function AirportDetailRunwayTableIconContext({
    icon,
    color
}) {
    const obj = useMemo(() => ({
        color,
    }), [color]);
    return (
        <div>
            <IconContext.Provider value={obj.color}>
                <div>
                    {icon}
                </div>
            </IconContext.Provider>
        </div>
    );
}

export default AirportDetailRunwayTableIconContext;
