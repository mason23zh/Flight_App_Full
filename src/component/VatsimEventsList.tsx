import React, { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { useTheme } from "../hooks/ThemeContext";
import { EventResponse } from "../store/apis/vatsimApi";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../util/VirtuosoScroller";

//TODO: Scroller day mode too dark.

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


    // let eventsList;

    const handleClick = () => {
        onClick();
    };


    // if (!_.isEmpty(allEvents) && allEvents.result !== 0) {
    //     eventsList = allEvents.events.map((e) => (
    //         <div key={e.id}>
    //             <VatsimEventsListItem
    //                 event={e}
    //                 onClick={handleClick}
    //             />
    //         </div>
    //     ));
    // }

    // const scrollBarStyle = darkMode
    //     ?
    //     "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
    //         "scrollbar-thumb-gray-300 scrollbar-track-slate-500"
    //     :
    //     "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
    //         "scrollbar-thumb-slate-400 scrollbar-track-gray-300";

    // return (
    //     <div className={`flex flex-col
    //     gap-2 overflow-y-auto
    //     p-3 min-w-[280px] sm:min-w-[350px] h-[calc(100vh-80px)] max-h-full ${scrollBarStyle}`}>
    //         {eventsList}
    //     </div>
    // );

    if (_.isEmpty(allEvents) || allEvents.result === 0) {
        return (
            <div>
                No Events
            </div>
        );
    }

    return (
        <div className="flex-1 h-full w-[90%] min-w-[18rem] sm:min-w-[22rem]">
            <Virtuoso
                data={events.events}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, event) => (
                    <VatsimEventsListItem
                        event={event}
                        onClick={handleClick}
                    />
                )}
            />
        </div>
    );

}

export default VatsimEventsList;
