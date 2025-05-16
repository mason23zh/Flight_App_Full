import moment from "moment";

export const returnOnlineTime = (logonTime: string) => {
    const logonTimeStamp = moment(logonTime);
    // duration in seconds and remove day
    let durationAsSeconds =
        moment.duration(moment(new Date()).diff(logonTimeStamp)).asSeconds() % 86400;
    const durationHour = durationAsSeconds / 3600;
    durationAsSeconds %= 3600;
    const durationMinute = durationAsSeconds / 60;
    //return `${Math.round(durationHour)}:${("0" + Math.round(durationMinute)).slice(-2)}`;

    // append 0 if minutes return as a single digit
    return {
        hour: Math.round(durationHour),
        minute: `${("0" + Math.round(durationMinute)).slice(-2)}`,
    };
};
