import React, { forwardRef, useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { useTheme } from "../hooks/ThemeContext";
import { EventResponse } from "../store/apis/vatsimApi";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../util/VirtuosoScroller";

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


    const handleClick = () => {
        onClick();
    };

    const scrollBarStyle = darkMode
        ?
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-gray-300 scrollbar-track-slate-500"
        :
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar " +
            "scrollbar-thumb-slate-400 scrollbar-track-gray-300";

    // To avoid typescript complain.
    const CustomScroller = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
        <Scroller
            {...props}
            ref={ref}
            className={scrollBarStyle}
        />
    ));

    CustomScroller.displayName = "VirtuosoCustomScroller";

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
                components={{
                    Scroller: CustomScroller
                }}
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
