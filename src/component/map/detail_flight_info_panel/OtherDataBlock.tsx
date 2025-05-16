import FlightPlanPanel from "./FlightPlanPanel";
import { AirportResponse, VatsimFlightPlan } from "../../../types";

interface OtherDataBlockProps {
    flight_plan: VatsimFlightPlan;
    depAirport: AirportResponse;
    arrAirport: AirportResponse;
}

const OtherDataBlock = ({ flight_plan, depAirport, arrAirport }: OtherDataBlockProps) => {
    if (!flight_plan) {
        return (
            <div className="text-sm text-white text-center">
                No Flight Plan Available For This Flight
            </div>
        );
    }

    return (
        <FlightPlanPanel
            flight_plan={flight_plan}
            depAirport={depAirport}
            arrAirport={arrAirport}
        />
    );
};

export default OtherDataBlock;
