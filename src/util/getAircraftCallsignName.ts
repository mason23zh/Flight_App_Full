import airlines from "./airlines.json";

const getAircraftCallsignName = (callsign: string) => {
    const icaoCallsign = callsign.slice(0, 3);

    const airliner = airlines.find(a => a.icao === icaoCallsign);

    return airliner ? airliner : null;
};

export default getAircraftCallsignName;