import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setMapProjection } from "../../../store";

//TODO: style improvement

const MapProjectionSwitchButton = () => {
    const dispatch = useDispatch();
    const [_, setActiveButton] = useState<"globe" | "mercator">("mercator");

    const { mapProjection } = useSelector((state: RootState) => state.vatsimMapVisible);

    const buttonStyle = "px-2 py-1 text-xs font-bold transition-colors duration-200 cursor-pointer";
    const activeStyle = "bg-blue-500 text-white";
    const inactiveStyle = "bg-gray-300 text-gray-700 hover:bg-gray-400";

    return (
        <div className="flex rounded-lg overflow-hidden">
            {/* Globe Button */}
            <button
                className={`${buttonStyle} ${
                    mapProjection === "globe" ? activeStyle : inactiveStyle
                }`}
                onClick={() => {
                    setActiveButton("globe");
                    dispatch(setMapProjection("globe"));
                }}
            >
                Globe
            </button>

            {/* Mercator Button */}
            <button
                className={`${buttonStyle} ${
                    mapProjection === "mercator" ? activeStyle : inactiveStyle
                }`}
                onClick={() => {
                    setActiveButton("mercator");
                    dispatch(setMapProjection("mercator"));
                }}
            >
                Mercator
            </button>
        </div>
    );
};

export default MapProjectionSwitchButton;
