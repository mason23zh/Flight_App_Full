import { VatsimFlight } from "../types";
import calculateArrivalTime from "./calculateArrivalTime";

const convertToMinutes = (time: string): number => {
    const hours = parseInt(time.substr(0, 2), 10);
    const minutes = parseInt(time.substr(2, 2), 10);
    return hours * 60 + minutes;
};

// Function to calculate flight progress
const calculateFlightProgress = (flight: VatsimFlight): number => {
    if (!flight || !flight?.flight_plan) return 0;
    const { flight_plan } = flight;

    if (!flight_plan.deptime || !flight_plan.enroute_time) return 0; // Safety check

    // Calculate estimated arrival time using calculateArrivalTime function
    const estimatedArrivalTime = calculateArrivalTime(
        flight_plan.deptime,
        flight_plan.enroute_time
    );

    // Convert deptime and estimatedArrivalTime to minutes since midnight
    const departureMinutes = convertToMinutes(flight_plan.deptime);
    const arrivalMinutes = convertToMinutes(estimatedArrivalTime);

    // Calculate total flight duration in minutes
    let totalFlightDuration = arrivalMinutes - departureMinutes;
    if (totalFlightDuration < 0) {
        totalFlightDuration += 1440; // Handle next day flight scenario
    }

    // Get current time in minutes since midnight
    const now = new Date();
    const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Calculate elapsed time since departure in minutes
    let elapsedTime = currentMinutes - departureMinutes;
    if (elapsedTime < 0) {
        elapsedTime += 1440; // Handle case if current time is past midnight and departure is before midnight
    }

    // Calculate progress percentage
    const progress = Math.min(Math.max((elapsedTime / totalFlightDuration) * 100, 0), 100); // Ensure it stays between 0-100%

    return progress;
};
export default calculateFlightProgress;
