/*
 * This function will extract Tracon's name if the tracon has not been found in the tracon GeoJson mapping file
 * The controller object contains a filed called text_atis, the Tracon's name is usually appears in this array/string
 * If not, construct the Tracon name using airport's name.
 *
 * */
import { Controller } from "../../../../types";

export const extractTraconName = (controller: Controller) => {
    const keywords = [
        "Approach",
        "Arrival",
        "APPROACH",
        "ARRIVAL",
        "APP",
        "DEP",
        "Departure",
        "departure",
    ];
    let traconName = "";

    const extractFromText = (text) => {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                const index = text.indexOf(keyword);
                return text.slice(0, index + keyword.length).trim();
            }
        }
        return "";
    };

    const { text_atis, airport, callsign } = controller;

    if (Array.isArray(text_atis)) {
        for (const text of text_atis) {
            const name = extractFromText(text);
            if (name) {
                traconName = name;
                break;
            }
        }
    } else if (typeof text_atis === "string" && text_atis.length > 0) {
        traconName = extractFromText(text_atis);
    }

    // If no TRACON name is found, construct from airport name and callsign
    if (!traconName && airport) {
        const airportName = airport.name.replace("Airport", "").trim();
        if (callsign.includes("APP")) {
            traconName = `${airportName} Approach`;
        } else if (
            callsign.includes("ARR") ||
            callsign.includes("DEP") ||
            callsign.includes("Arrival") ||
            callsign.includes("Departure")
        ) {
            traconName = `${airportName} Arrival`;
        }
    }

    return traconName;
};
