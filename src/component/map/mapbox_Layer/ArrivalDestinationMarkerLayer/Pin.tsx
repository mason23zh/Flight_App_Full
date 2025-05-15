/**
 * Render the Departure or Arrival icon within the Marker icon
 * Pin Icon credit:https://github.com/visgl/react-map-gl/blob/7.1-release/examples/controls/src/pin.tsx
 * **/

import * as React from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { ReactElement } from "react";

interface PinProps {
    size: number,
    type: "DEPARTURE" | "ARRIVAL"
}


const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;


function Pin({
    size = 20,
    type
}: PinProps) {

    let iconToRender: ReactElement;

    let pinStyle = {
        cursor: "pointer",
        fill: "#d00",
        stroke: "none"
    };

    if (type === "DEPARTURE") {
        pinStyle = {
            ...pinStyle,
            fill: "#fc4f4f"
        };
        iconToRender = <FaPlaneDeparture color="white" size={20}/>;
    } else if (type === "ARRIVAL") {
        pinStyle = {
            ...pinStyle,
            fill: "#09d654"
        };
        iconToRender = <FaPlaneArrival color="white" size={20}/>;
    }


    return (
        <div style={{
            position: "relative",
            width: size,
            height: size
        }}>
            <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
                <path d={ICON}/>
            </svg>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                {iconToRender}
            </div>
        </div>
    );
}

export default React.memo(Pin);