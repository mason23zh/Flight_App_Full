import React from "react";
import OverallDataBlock from "./OverallDataBlock";
import LiveDataBlock from "./LiveDataBlock";
import OtherDataBlock from "./OtherDataBlock";
import FlightProgressBar from "./FlightProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { VatsimFlight } from "../../../types";

const FlightInfo = () => {
    const defaultTraffic = {
        altitude: 0,
        callsign: "",
        cid: 0,
        groundspeed: 0,
        heading: 0,
        last_updated: "",
        latitude: 0,
        logon_time: "",
        longitude: 0,
        military_rating: 0,
        name: "",
        pilot_rating: 0,
        qnh_i_hg: 0,
        qnh_mb: 0,
        server: "",
        transponder: "",
        flight_plan: {
            flight_rules: "",
            aircraft: "",
            aircraft_faa: "",
            aircraft_short: "",
            alternate: "",
            altitude: "",
            arrival: "",
            assigned_transponder: "",
            cruise_tas: "",
            departure: "",
            deptime: "",
            enroute_time: "",
            fuel_time: "",
            remarks: "",
            revision_id: 0,
            route: ""
        }
    };


    const traffic = useSelector<RootState, VatsimFlight>(
        state => state.vatsimMapTraffic.selectedTraffic || null);

    if (!traffic) {
        return <></>;
    }
    console.log("selected traffic:", traffic);


    return (
        <div className="z-[200] absolute max-w-[300px] min-w-[300px]">
            <div className="grid-cols-1">
                <OverallDataBlock
                    callsign={traffic.callsign}
                    flight_plan={traffic.flight_plan}
                />

                <LiveDataBlock
                    altitude={traffic.altitude}
                    groundspeed={traffic.groundspeed}
                    departure={traffic.flight_plan?.departure}
                    arrival={traffic.flight_plan?.arrival}
                />

                <OtherDataBlock/>

                <FlightProgressBar/>
            </div>
        </div>
    );
};

export default FlightInfo;