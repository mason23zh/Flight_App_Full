import React from "react";
import { VatsimFlight } from "../../../../types";

interface Props {
    flight: VatsimFlight;
}

const SearchBoxFlightElement = ({ flight }: Props) => {
    return (
        <div className="p-2 grid grid-rows-2">
            <div className="text-[16px]">
                {flight.callsign}
            </div>
            <div className="flex gap-1">
                <div>
                    {flight.flight_plan?.departure || "N/A"}
                </div>
                <div>
                    -
                </div>
                <div>
                    {flight.flight_plan?.arrival || "N/A"}
                </div>
                <div>
                    -
                </div>
                <div>
                    {flight.flight_plan?.aircraft_faa || "N/A"}
                </div>
            </div>
        </div>
    );
};

export default SearchBoxFlightElement;