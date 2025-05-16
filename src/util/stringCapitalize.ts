export const capitalizeFirstLetter = (str: string) => {
    if (!str || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeAllLetter = (str: string) => {
    if (!str || str.length === 0) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");
};
