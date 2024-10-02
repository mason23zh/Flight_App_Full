// render side view of vatsim events
import React, { useEffect, useState } from "react";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import moment from "moment/moment";
import { CustomProvider } from "rsuite";
import { useSelector } from "react-redux";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { useTheme } from "../hooks/ThemeContext";
import { Event } from "../types/index";

function VatsimEventDetail({ onlyDetail }) {

    const darkTheme = useTheme();
    const navigate = useNavigate();
    let renderAirportList;
    const [event, setEvent] = useState<Partial<Event>>({});
    const reduxEvent: Partial<Event> = useSelector((state: RootState) => state.vatsimEvent.userSelectionVatsimEvent);
    // This useEffect will handle the case if user open a new tab on the Home page
    // The localStorage will be stored if user click 'go-to' button in HomeVatsimEventInfoTab
    useEffect(() => {
        if (!reduxEvent?.id && localStorage.getItem("vatsimEvent")) {
            setEvent(JSON.parse(localStorage.getItem("vatsimEvent")));
        } else if (reduxEvent) {
            setEvent(reduxEvent);
        } else {
            navigate("/");
        }
    }, [reduxEvent]);


    const handleClick = () => {
        navigate("/vatsim/events");
    };

    const renderEventJumpBackButton = () => {
        if (onlyDetail) {
            return (
                <div
                    onClick={handleClick}
                    className="flex items-center gap-1 ml-5 p-1 mt-3 text-lg hover:text-cyan-600 hover:cursor-pointer"
                >
                    <div>
                        <HiOutlineArrowNarrowLeft size={20}/>
                    </div>
                    <div className="font-bold">Events</div>
                </div>
            );
        }
        return <></>;
    };

    const renderTime = (startTime, endTime, utcFlag) => {
        if (startTime && endTime && utcFlag) {
            return (
                <div>{moment(startTime)
                    .utc()
                    .format("D MMM")} @ {moment(startTime)
                    .utc()
                    .format("HH:mm")} to {moment(endTime)
                    .utc()
                    .format("HH:mm")} (UTC)
                </div>
            );
        }
        if (startTime && endTime && !utcFlag) {
            return (
                <div>{moment(startTime)
                    .format("D MMM")} @ {moment(startTime)
                    .format("HH:mm")} to {moment(endTime)
                    .format("HH:mm")} (Local)
                </div>
            );
        }
        return (<></>);
    };

    const renderImage = (
        <div>
            <img className="w-[810px] rounded-xl" src={event.banner} alt={event.name}/>
        </div>
    );

    const airportStyle = darkTheme
        ? "rounded-xl border-2 bg-blue-500 border-blue-200 opacity-90 p-1"
        : "rounded-xl border-2 bg-blue-400 border-blue-200 opacity-90 p-1";

    if (!_.isEmpty(event)) {
        renderAirportList = event.airports.map((airport) => (
            <div key={airport.icao}>
                <div className={airportStyle}>
                    <a href={`airport/detail/${airport.icao}`}>
                        {airport.icao}
                    </a>
                </div>
            </div>
        ));
    }

    return (
        <CustomProvider theme={darkTheme ? "dark" : "light"}>
            {renderEventJumpBackButton()}
            <div className="flex justify-center">
                <div className="p-10 grid grid-cols-1 lg:grid-cols-5 gap-10 ml-5 mr-5 max-w-[1400px]">
                    <div className="col-span-3">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="text-3xl sm:text-5xl justify-self-start font-bold">
                                {event.name}
                            </div>
                            <div className="text-md sm:text-xl justify-self-start">
                                {renderTime(event.start_time, event.end_time, false)}
                            </div>
                            <div className="flex gap-1 justify-self-start flex-wrap">
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
                                <div dangerouslySetInnerHTML={{ __html: event.description }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}

export default VatsimEventDetail;
