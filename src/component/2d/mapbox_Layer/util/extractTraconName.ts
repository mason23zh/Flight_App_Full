export const extractTraconName = (textAtisArray) => {
    const keywords = ["Approach", "Arrival", "APPROACH", "ARRIVAL", "APP", "DEP", "Departure", "departure"];

    for (const text of textAtisArray) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                // Extract everything before the keyword
                const index = text.indexOf(keyword);
                return text.slice(0, index + keyword.length)
                    .trim();
            }
        }
    }

    // Return an empty string if no valid TRACON name is found
    return "";
};