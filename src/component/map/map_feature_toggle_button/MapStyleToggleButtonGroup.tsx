import { useDispatch, useSelector } from "react-redux";
import { RootState, switchMapStyles } from "../../../store";

//TODO: Remove the light map mode until map style is better.
//
type MapStyle = "DEFAULT" | "MONO_LIGHT" | "MONO_DARK" | "SATELLITE";

const MapStyleToggleButtonGroup = () => {
    const dispatch = useDispatch();
    const { mapStyles } = useSelector((state: RootState) => state.vatsimMapVisible);

    const activeButtonStyle = "p-1 bg-gray-400 hover:bg-gray-600 rounded-md";
    const inactiveButtonStyle = "p-1 bg-gray-500 hover:bg-gray-600 rounded-md";

    const handleOnClick = (mapStyle: MapStyle) => {
        dispatch(switchMapStyles({ mapStyles: mapStyle }));
    };

    return (
        <div className="container min-w-[80px]">
            <div className="flex flex-col gap-1 rounded-md bg-gray-700 text-sm p-2 text-white">
                <button
                    className={mapStyles === "DEFAULT" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("DEFAULT")}
                >
                    VFR
                </button>

                {/* <button */}
                {/*     className={mapStyles === "MONO_LIGHT" ? activeButtonStyle : inactiveButtonStyle} */}
                {/*     onClick={() => handleOnClick("MONO_LIGHT")}> */}
                {/*     Light */}
                {/* </button> */}

                <button
                    className={mapStyles === "MONO_DARK" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("MONO_DARK")}
                >
                    Dark
                </button>

                <button
                    className={mapStyles === "SATELLITE" ? activeButtonStyle : inactiveButtonStyle}
                    onClick={() => handleOnClick("SATELLITE")}
                >
                    Satellite
                </button>
            </div>
        </div>
    );
};

export default MapStyleToggleButtonGroup;
