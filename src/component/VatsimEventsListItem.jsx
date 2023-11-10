import React from "react";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { changeUserSelectionVatsimEvent } from "../store";

function VatsimEventsListItem({ event }) {
    const dispatch = useDispatch();
    const {
        name, start_time, end_time, airports,
    } = event;
    let renderAirportList;
    
    // check if the event is in progress
    const checkCurrent = (startTime, endTime) => {
        if (startTime && endTime) {
            const currentTime = new Date(new Date()).toISOString();
            if (currentTime >= startTime && currentTime <= endTime) {
                return true;
            }
            return false;
        }
        return false;
    };
    
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
            <div key={Math.random(event.id)}>
                <div className="rounded-xl border-2 bg-blue-400 border-blue-200 opacity-90 p-1">
                    <a href={`airport/detail/${airport.icao}`}>
                        {airport.icao}
                    </a>
                </div>
            </div>
        ));
    }
    // top-0 right-0 translate-x-[-300%]
    const renderInProgress = (startTime, endTime) => (checkCurrent(startTime, endTime) ? (
        <div className="absolute h-5 w-auto top-0 right-0 mt-1 mr-1">
            <div className="flex gap-1 items-center bg-green-500 text-sm p-1 rounded-xl">
                <div>
                    <AiOutlineExclamationCircle />
                </div>
                <div className="">
                    In Progress
                </div>
            </div>
        </div>
    ) : <></>);
    
    const handleClick = () => {
        dispatch(changeUserSelectionVatsimEvent(event));
    };
    
    return (
        <div className="grid grid-cols-1 p-3 border-2 bg-gray-400 rounded-xl relative" onClick={handleClick}>
            {renderInProgress(start_time, end_time)}
                
            <div className="justify-self-start">
                {name}
            </div>
            <div className="justify-self-start">
                {renderTime(start_time, end_time, true)}
            </div>
            <div className="justify-self-start">
                <div className="flex gap-1 flex-wrap">
                    {renderAirportList}
                </div>
            </div>
            {checkCurrent(start_time, end_time)}
        </div>
    );
}

export default VatsimEventsListItem;
