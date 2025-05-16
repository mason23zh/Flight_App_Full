import { VatsimFlight } from "../../../../../types";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
    closeSearchResults,
    setAircraftListDisplay,
    setFilterAircraftOnMap_aircraft,
    setSelectedAircraftCategory,
} from "../../../../../store";

interface Props {
    aircraft: VatsimFlight[] | null;
}

const AircraftInfoPanel = ({ aircraft }: Props) => {
    const dispatch = useDispatch();

    if (!aircraft) return <></>;

    const handClick = () => {
        // close the Aircraft List display
        dispatch(setAircraftListDisplay(false));
        // reset traffic filter on the map
        dispatch(setSelectedAircraftCategory(""));
        dispatch(setFilterAircraftOnMap_aircraft(false));
        //dispatch the close search results action
        dispatch(closeSearchResults());
    };

    return (
        <div className="grid grid-cols-1 p-2 border-b">
            <div className="grid grid-cols-4">
                <div className="col-span-3">
                    <div className="font-bold text-lg">
                        {aircraft[0]?.flight_plan.aircraft_short || "N/A"}
                    </div>
                    <div className="text-sm italic font-bold">
                        {aircraft[0]?.flight_plan?.aircraft_name || ""}
                    </div>
                </div>
                <div
                    onClick={handClick}
                    className="justify-self-end text-[19px] hover:cursor-pointer"
                >
                    <IoMdCloseCircleOutline />
                </div>
            </div>
        </div>
    );
};

export default AircraftInfoPanel;
