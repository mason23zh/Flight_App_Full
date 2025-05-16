const calculateArrivalTime = (etd: string, enroute: string) => {
    // Convert ETD to minutes
    const etdHours = parseInt(etd.substr(0, 2), 10);
    const etdMinutes = parseInt(etd.substr(2, 2), 10);
    const etdTotalMinutes = etdHours * 60 + etdMinutes;

    // Convert enroute time to minutes
    const enrouteHours = parseInt(enroute.substr(0, 2), 10);
    const enrouteMinutes = parseInt(enroute.substr(2, 2), 10);
    const enrouteTotalMinutes = enrouteHours * 60 + enrouteMinutes;

    // Calculate total arrival time in minutes
    const totalMinutes = etdTotalMinutes + enrouteTotalMinutes;

    // Convert total minutes back to 24-hour format
    const arrivalHours = Math.floor(totalMinutes / 60) % 24; // Using % 24 to convert hours into 24-hour format
    const arrivalMinutes = totalMinutes % 60;

    // Format the hours and minutes to always have two digits
    const formattedHours = arrivalHours.toString().padStart(2, "0");
    const formattedMinutes = arrivalMinutes.toString().padStart(2, "0");

    return `${formattedHours}${formattedMinutes}`;
};

export default calculateArrivalTime;
