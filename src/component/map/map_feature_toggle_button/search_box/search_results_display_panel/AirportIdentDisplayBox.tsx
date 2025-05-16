import { BiTargetLock } from "react-icons/bi";
import { LocalDbAirport } from "../../../../../types";
import { useDispatch } from "react-redux";
import { setAirportTracking, setTrafficTracking } from "../../../../../store";
import useDisplayTooltip from "../../../../../hooks/useDisplayTooltip";
import useIsTouchScreen from "../../../../../hooks/useIsTouchScreen";
import { useMap } from "react-map-gl";

interface Props {
    airport: LocalDbAirport;
}

const AirportIdentDisplayBox = ({ airport }: Props) => {
    const dispatch = useDispatch();
    const isTouchScreen = useIsTouchScreen();
    const { current: mapRef } = useMap();

    const { handleMouseEnter, handleMouseLeave, handleMouseMove, tooltipVisible } =
        useDisplayTooltip(200);

    const handleClick = () => {
        //make sure the flight tracking is off
        dispatch(setTrafficTracking(false));
        // move the map to the airport
        dispatch(setAirportTracking(true));

        if (mapRef) {
            const map = mapRef?.getMap();
            if (map) {
                map.flyTo({
                    center: [
                        Number(airport.coordinates.split(",")[0]),
                        Number(airport.coordinates.split(",")[1]),
                    ],
                    zoom: 13,
                });
            }
        }
    };
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-2">
                <div className="flex items-center gap-1 border-[1px] text-xs rounded-lg px-1 py-0">
                    <div>{airport?.iata_code || "-"}</div>
                    <div>/</div>
                    <div className="font-bold">{airport?.ident || "-"}</div>
                </div>
            </div>
            <div
                className="hover:cursor-pointer hover:text-blue-400 relative"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <BiTargetLock />
                {tooltipVisible && !isTouchScreen && (
                    <div
                        className="absolute left-full top-1/2
                                transform -translate-y-1/2 ml-2
                                bg-blue-500 text-white text-xs
                                rounded-md px-2 py-1 flex whitespace-nowrap"
                    >
                        <div>Move to airport</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AirportIdentDisplayBox;
