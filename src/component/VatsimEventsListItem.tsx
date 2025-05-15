import { ReactNode } from "react";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { changeUserSelectionVatsimEvent } from "../store";
import { useTheme } from "../hooks/ThemeContext";
import { RootState } from "../store";
import { Event } from "../types";

interface PartialEvent extends Partial<Event> {
}

interface Props {
    event: Event,
    onClick: (e: Event) => void,
}

function VatsimEventsListItem({
    event,
    onClick,
}: Props) {
    const darkMode = useTheme();
    const dispatch = useDispatch();
    const e: PartialEvent = useSelector<RootState>((state) => state.vatsimEvent.userSelectionVatsimEvent);
    const generateTheme = (storeEvent: PartialEvent, currentEvent: PartialEvent) => {
        let generatedTheme: string;
        if (darkMode && (storeEvent.id === currentEvent.id)) {
            generatedTheme = "grid grid-cols-1 p-3 border-2 bg-indigo-500 rounded-xl relative "
                + "transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 "
                + "hover:scale-100 hover:bg-indigo-400 duration-300";
        } else if (darkMode && (storeEvent.id !== currentEvent.id)) {
            generatedTheme = "grid grid-cols-1 p-3 border-[1px] bg-gray-500 rounded-xl relative "
                + "transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 "
                + "hover:scale-100 hover:bg-indigo-400 duration-300";
        } else if (!darkMode && (storeEvent.id === currentEvent.id)) {
            generatedTheme = "grid grid-cols-1 p-3 border-2 bg-indigo-400 rounded-xl relative "
                + "transition ease-in-out delay-50 bg-blue-400 hover:-translate-y-1 "
                + "hover:scale-100 hover:bg-indigo-400 duration-300 text-gray-100";
        } else if (!darkMode && (storeEvent.id !== currentEvent.id)) {
            generatedTheme = "grid grid-cols-1 p-3 border-2 bg-gray-300 rounded-xl relative "
                + "transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 "
                + "hover:scale-100 hover:bg-indigo-300 duration-300";
        }
        return generatedTheme;
    };

    const airportIconStyle = darkMode
        ? "rounded-xl border-2 bg-blue-500 border-blue-200 opacity-90 p-1"
        : "rounded-xl border-2 bg-blue-400 border-blue-200 opacity-90 p-1";

    const {
        name,
        start_time,
        end_time,
    } = event;

    let renderAirportList: ReactNode;

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

    if (event.airports && event.airports.length) {
        renderAirportList = event.airports.map((airport) => (
            <div key={Math.random()}>
                <div className={airportIconStyle}>
                    <Link to={`/airport/detail/${airport.icao}`}>
                        {airport.icao}
                    </Link>
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
        // This will trigger event list to close when click the event list
        // in the drawer
        onClick(event);
    };


    return (
        <div
            className={generateTheme(e, event)}
            onClick={handleClick}
        >
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
