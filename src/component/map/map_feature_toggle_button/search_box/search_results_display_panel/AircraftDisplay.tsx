import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import AircraftInfoPanel from "./AircraftInfoPanel";
import SearchBoxFlightDisplaySection from "../SearchBoxFlightDisplaySection";

const AircraftDisplay = () => {
    const { selectedAircraftType } = useSelector((state: RootState) => state.mapSearchAircraft);

    const wrapperStyle = "absolute z-[200] top-5 sm:top-0 left-1/2 transform -translate-x-1/2" +
        " w-[19rem] sm:w-[22rem] max-w-[90%] sm:right-5 sm:left-auto sm:translate-x-0 sm:translate-y-[5%] " +
        "bottom-10 max-h-[40rem] min-h-[15rem]";

    return (
        <div className={wrapperStyle}>
            <div className="flex flex-col h-[90%] bg-gray-500 text-white rounded-lg overflow-hidden">
                <div>
                    <AircraftInfoPanel
                        aircraft={selectedAircraftType.length ? selectedAircraftType : null}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <SearchBoxFlightDisplaySection flights={selectedAircraftType} />
                </div>
            </div>
        </div>
    );
};

export default AircraftDisplay;