import React, { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { Event } from "../types";

interface AllEvents {
    results: number,
    events: [Event]
}

interface Props {
    events: AllEvents,
    onClick: () => void
}

function VatsimEventsList({
    events,
    onClick
}: Props) {
    const [allEvents, setAllEvents] = useState<Partial<AllEvents>>({});

    useEffect(() => {
        if (!_.isEmpty(events)) {
            setAllEvents(() => events);
        }
    }, [events]);


    let eventsList;

    const handleClick = () => {
        onClick();
    };


    if (!_.isEmpty(allEvents) && allEvents.results !== 0) {
        eventsList = allEvents.events.map((e) => (
            <div key={e.id}>
                <VatsimEventsListItem
                    event={e}
                    onClick={handleClick}
                />
            </div>
        ));
    }

    return (
        <div className="flex flex-col
        gap-2 overflow-y-auto
        p-3 min-w-[280px] sm:min-w-[350px] h-[calc(100vh-80px)] max-h-full">
            {eventsList}
        </div>
    );

}

export default VatsimEventsList;
