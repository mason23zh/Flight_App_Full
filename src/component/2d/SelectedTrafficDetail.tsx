import React from "react";
import { VatsimFlight } from "../../types";

function SelectedTrafficDetail(props: { traffic: VatsimFlight }) {
    const { traffic } = props;
    return (
        <div className="bg-amber-600 px-2 py-3 z-1 absolute top-40 left-0 m-[12px] rounded-md">
            <div className="grid grid-cols-1">
                <div>
                    {traffic.callsign || ""}
                </div>
                <div className="flex gap-3">
                    <div className="grid grid-cols-1">
                        <div>
                            Speed
                        </div>
                        <div>
                            {traffic.groundspeed || 0} kt
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div>
                            Altitude
                        </div>
                        <div>
                            {traffic.altitude || 0} ft
                        </div>
                    </div>
                </div>
                <div className="bg-red-600">
                    <div className="flex gap-3">
                        <div>Departure</div>
                        <div>{traffic.flight_plan?.departure || ""}</div>
                    </div>
                    <div className="flex gap-3">
                        <div>Arrival</div>
                        <div>{traffic.flight_plan?.arrival || ""}</div>
                    </div>
                    <div className="flex gap-3">
                        <div>Alternate</div>
                        <div>{traffic.flight_plan?.alternate || "N/A"}</div>
                    </div>
                    <div className="flex gap-3">
                        <div>Aircraft</div>
                        <div>{traffic.flight_plan?.aircraft_short}</div>
                    </div>
                    <div className="flex gap-3">
                        <div>Name</div>
                        <div>{traffic.name || ""}</div>
                    </div>
                    <div className="flex gap-3">
                        <div>Squawk</div>
                        <div>{traffic.transponder || ""}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedTrafficDetail;
