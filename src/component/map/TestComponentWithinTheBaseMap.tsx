import React, { useEffect } from "react";
import { useMap } from "react-map-gl";

const TestComponentWithinTheBaseMap = () => {
    const { current: map } = useMap();

    useEffect(() => {
        if (map) {
            console.log("Map ref:", map.getMap());
        } else {
            console.log("No map.");
        }
       
    }, [map]);

    return (
        <div>
        </div>
    );
};

export default TestComponentWithinTheBaseMap;