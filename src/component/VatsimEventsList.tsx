import React, { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { useTheme } from "../hooks/ThemeContext";
import { EventResponse } from "../store/apis/vatsimApi";


interface Props {
    events: EventResponse,
    onClick: () => void
}

function VatsimEventsList({
    events,
    onClick
}: Props) {
    const darkMode = useTheme();
    const [allEvents, setAllEvents] = useState<EventResponse | null>(null);

    useEffect(() => {
        if (!_.isEmpty(events)) {
            setAllEvents(() => events);
        }
    }, [events]);


    let eventsList;

    const handleClick = () => {
        onClick();
    };


    if (!_.isEmpty(allEvents) && allEvents.result !== 0) {
        eventsList = allEvents.events.map((e) => (
            <div key={e.id}>
                <VatsimEventsListItem
                    event={e}
                    onClick={handleClick}
                />
            </div>
        ));
    }

    const scrollBarStyle = darkMode
        ?
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-gray-300 scrollbar-track-slate-500"
        :
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-slate-400 scrollbar-track-gray-300";

    return (
        <div className={`flex flex-col
        gap-2 overflow-y-auto
        p-3 min-w-[280px] sm:min-w-[350px] h-[calc(100vh-80px)] max-h-full ${scrollBarStyle}`}>
            {eventsList}
        </div>
    );

}

export default VatsimEventsList;
