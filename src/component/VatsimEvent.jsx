import React, { useEffect, useState } from "react";
import { CustomProvider } from "rsuite";
import { Link, Navigate, useNavigate } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import { useTheme } from "../hooks/ThemeContext";

function VatsimEvent() {
    const darkTheme = useTheme();
    const navigate = useNavigate();
    const [event, setEvent] = useState({});
    let renderAirportList;
    
    useEffect(() => {
        if (!localStorage.getItem("vatsimEvent")) {
            navigate("/");
        }
        const vatsimEvent = JSON.parse(localStorage.getItem("vatsimEvent"));
        if (!_.isEmpty(vatsimEvent)) {
            setEvent((pre) => vatsimEvent);
        }
    }, []);
    
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
    
    const renderImage = (
        <div>
            <img src={event.banner} alt={event.name} width="810px" />
        </div>
    );
    
    console.log("vatsim event from vatsim event:", event);
    if (!_.isEmpty(event)) {
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
    
    
    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            <div className="flex justify-center">
                <div className="p-10 grid grid-cols-5 gap-10 ml-5 mr-5 max-w-[1400px]">
                    <div className="col-span-3">
                        <div className="grid grid-cols-1 gap-2">
                            <div className="text-5xl justify-self-start">
                                {event.name}
                            </div>
                            <div className="text-xl justify-self-start">
                                {renderTime(event.start_time, event.end_time, false)}
                            </div>
                            <div className="flex gap-1 justify-self-start">
                                {renderAirportList}
                            </div>
                            <div className="justify-self-start">
                                {renderImage}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="grid grid-cols-1 gap-2">
                            <div className="text-3xl justify-self-start">
                                Description
                            </div>
                            <div className="text-xl overflow-hidden">
                                <div dangerouslySetInnerHTML={{ __html: event.description }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEvent;
