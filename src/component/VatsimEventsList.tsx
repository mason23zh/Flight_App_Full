import React, { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { Event } from "../types";

interface AllEvents {
    results: number,
    events: [Event]
}

function VatsimEventsList({
    events,
    onClick
}) {
    const [allEvents, setAllEvents] = useState<Partial<AllEvents>>({});
    let eventsList;

    const handleClick = () => {
        onClick();
    };

    useEffect(() => {
        if (!_.isEmpty(events)) {
            setAllEvents(() => events);
        }
    }, []);

    if (!_.isEmpty(allEvents) && allEvents.results !== 0) {
        eventsList = allEvents.events.map((e) => (
            <div key={e.id}>
                <VatsimEventsListItem event={e} onClick={handleClick}/>
            </div>
        ));
    }

    return (
        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-100px)] p-3 min-w-[280px] sm:min-w-[350px]">
            {eventsList}
        </div>
    );
}

export default VatsimEventsList;
