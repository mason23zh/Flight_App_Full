// render side view of vatsim events
import React from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import moment from "moment/moment";
import { CustomProvider } from "rsuite";
import { useSelector } from "react-redux";
import { useTheme } from "../hooks/ThemeContext";

function VatsimEventDetail() {
    const event = useSelector((state) => state.vatsimEvent.userSelectionVatsimEvent);
    
    const darkTheme = useTheme();
    const navigate = useNavigate();
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
    
    const renderImage = (
        <div>
            <img className="w-[810px] rounded-xl" src={event.banner} alt={event.name} />
        </div>
    );
    
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
                <div className="p-10 grid grid-cols-1 md:grid-cols-5 gap-10 ml-5 mr-5 max-w-[1400px]">
                    <div className="col-span-3">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="text-3xl sm:text-5xl justify-self-start font-bold">
                                {event.name}
                            </div>
                            <div className="text-md sm:text-xl justify-self-start">
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
                            <div className="text-xl sm:text-2xl justify-self-start font-bold">
                                DESCRIPTION
                            </div>
                            <div className="text-md sm:text-xl overflow-hidden">
                                <div dangerouslySetInnerHTML={{ __html: event.description }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventDetail;
