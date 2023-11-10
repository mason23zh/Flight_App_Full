import React, { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";

function VatsimEventsList({ events }) {
    const [allEvents, setAllEvents] = useState({});
    let eventsList;
    
    useEffect(() => {
        if (!_.isEmpty(events)) {
            setAllEvents((pre) => events);
        }
    }, []);
    
    if (!_.isEmpty(allEvents) && allEvents.results !== 0) {
        eventsList = allEvents.events.map((e) => (
            <div key={e.id}>
                <VatsimEventsListItem event={e} />
            </div>
        ));
    }
    
    return (
        <div className="flex flex-col gap-2 overflow-y-auto h-screen p-3 min-w-[350px]">
            {eventsList}
        </div>
    );
}

export default VatsimEventsList;
