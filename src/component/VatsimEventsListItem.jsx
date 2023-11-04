import React from "react";
import moment from "moment/moment";
import _ from "lodash";

function VatsimEventsListItem({ event }) {
    const {
        name, start_time, end_time, airports,
    } = event;
    let renderAirportList;
    const renderTime = (startTime, endTime, utcFlag) => {
        if (startTime && endTime && utcFlag) {
            return (
                <div>{moment(startTime).utc().format("D MMM")} @ {moment(startTime)
                    .utc()
                    .format("HH:mm")} to {moment(endTime).utc()
                    .format("HH:mm")} (UTC)
                </div>
            );
        }
        if (startTime && endTime && !utcFlag) {
            return (
                <div>{moment(startTime).format("D MMM")} @ {moment(startTime)
                    .format("HH:mm")} to {moment(endTime)
                    .format("HH:mm")} (Local)
                </div>
            );
        }
        return (<></>);
    };
    
    if (event.airports && event.airports.length !== 0) {
        renderAirportList = event.airports.map((airport) => (
            <div key={airport.icao}>
                <div className="rounded-xl border-2 bg-blue-400 border-blue-200 opacity-90 p-1">
                    <a href={`airport/detail/${airport.icao}`}>
                        {airport.icao}
                    </a>
                </div>
            </div>
        ));
    }
    
    const handleClick = () => {
        localStorage.setItem("vatsimEvent", JSON.stringify(event));
    };
    
    return (
        <div className="grid grid-cols-1 p-3 border-2 bg-gray-400 rounded-xl" onClick={handleClick}>
            <div className="justify-self-start">
                {name}
            </div>
            <div className="justify-self-start">
                {renderTime(start_time, end_time, true)}
            </div>
            <div className="justify-self-start">
                <div className="flex flex-wrap">
                    {renderAirportList}
                </div>
            </div>
        </div>
    );
}

export default VatsimEventsListItem;
