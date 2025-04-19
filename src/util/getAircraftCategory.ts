/*
 * Return aircraft scale.
 *
 * The default aircraft size in png are different.
 * The narrow body aircraft is way too small compare with wide body aircraft.
 * This function will adjust the size, which make narrow body aircraft bigger and wide body smaller
 */
export const getAircraftSizeCategory = (aircraftCode: string) => {
    const aircraftCategories = {
        wideBody: [
            "A3ST",
            "A306",
            "A310",
            "A332",
            "A333",
            "A337",
            "A338",
            "A339",
            "A342",
            "A343",
            "A345",
            "A346",
            "A359",
            "A35K",
            "A388",
            "A124",
            "A225",
            "B742",
            "B744",
            "B748",
            "B74S",
            "B762",
            "B763",
            "B764",
            "B772",
            "B773",
            "B77L",
            "B77W",
            "B779",
            "B777",
            "B788",
            "B789",
            "B78X",
            "IL62",
            "IL76",
            "MD11",
            "DC10",
            "CONC",
        ],
        narrowBody: [
            "A318",
            "A319",
            "A320",
            "A321",
            "A20N",
            "A21N",
            "AS21",
            "B712",
            "B722",
            "B732",
            "B733",
            "B734",
            "B735",
            "B737",
            "B738",
            "P8",
            "B739",
            "B752",
            "B753",
            "B38M",
            "B39M",
            "BCS1",
            "BCS3",
            "T204",
            "DC3",
        ],
        regional: [
            "AT45",
            "AT72",
            "AT76",
            "CRJ1",
            "CRJ2",
            "CRJ7",
            "CRJ9",
            "CRJX",
            "D228",
            "D328",
            "E170",
            "E190",
            "DH8A",
            "DH8B",
            "DH8C",
            "DH8D",
            "F50",
            "SF34",
            "J328",
            "ARJ2",
            "B190",
            "CN35",
            "E195",
            "MD83",
        ],
        businessJet: [
            "C25A",
            "C25B",
            "C25C",
            "C500",
            "C550",
            "C56X",
            "C680",
            "C750",
            "CL30",
            "CL35",
            "CL60",
            "E35L",
            "E50P",
            "E55P",
            "E545",
            "E550",
            "FA50",
            "FA7X",
            "GL5T",
            "GL6T",
            "G150",
            "G280",
            "GLEX",
            "HDJT",
            "LJ35",
            "LJ45",
            "LJ60",
            "LR45",
            "LR60",
            "P180",
            "GLF6",
        ],
        generalAviation: [
            "C172",
            "BT36",
            "C182",
            "C206",
            "C208",
            "C210",
            "DA40",
            "DA42",
            "DR40",
            "DV20",
            "PA24",
            "P28A",
            "P28B",
            "P28R",
            "P28T",
            "P32R",
            "P32T",
            "P46T",
            "PC6",
            "PC9",
            "PC12",
            "PC24",
            "SR20",
            "SR22",
            "B350",
            "PA46",
            "PC6T",
            "TBM9",
        ],
        helicopter: [
            "AS32",
            "AS50",
            "AS55",
            "AS65",
            "AS66",
            "B06",
            "B407",
            "B412",
            "B429",
            "EC20",
            "EC25",
            "EC30",
            "EC35",
            "EC45",
            "H500",
            "H60",
            "NH90",
            "R22",
            "R44",
            "R66",
            "S61",
            "S76",
            "S92",
            "UH1",
        ],
        military: [
            "A400",
            "AN22",
            "AN26",
            "AN30",
            "AN32",
            "C130",
            "C135",
            "C160",
            "C17",
            "E3CF",
            "F16",
            "H47",
            "H53",
            "KC10",
            "KC135",
            "L101",
            "M28",
            "P3",
            "S3",
            "T6",
            "T38",
            "U2",
            "VC25",
            "V22",
            "C295",
            "B1",
        ],
    };

    let scale = 7; // Default scale if no category matches

    // Loop through each category
    for (const [category, codes] of Object.entries(aircraftCategories)) {
        if (codes.includes(aircraftCode)) {
            switch (category) {
            case "wideBody":
                scale = 12;
                break;
            case "narrowBody":
                scale = 10;
                break;
            case "regional":
                scale = 9;
                break;
            case "businessJet":
                scale = 9;
                break;
            case "generalAviation":
                scale = 7;
                break;
            case "helicopter":
                scale = 13;
                break;
            case "military":
                scale = 10;
                break;
            }
            return scale;
        }
    }
    // for (const [category, codes] of Object.entries(aircraftCategories)) {
    //     if (codes.includes(aircraftCode)) {
    //         switch (category) {
    //         case "wideBody":
    //             scale = 7.3;
    //             break;
    //         case "narrowBody":
    //             scale = 11;
    //             break;
    //         case "regional":
    //             scale = 11;
    //             break;
    //         case "businessJet":
    //             scale = 17;
    //             break;
    //         case "generalAviation":
    //             scale = 17;
    //             break;
    //         case "helicopter":
    //             scale = 20;
    //             break;
    //         case "military":
    //             scale = 10;
    //             break;
    //         }
    //         return scale;
    //     }
    // }

    return scale; // Return default scale if no match
};
