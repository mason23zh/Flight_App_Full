import React from "react";
import HomeVatsimEventInfoTab from "./HomeVatsimEventInfoTab";

function HomeVatsimEvents({ vatsimEvents }) {
    const {
        events,
        results
    } = vatsimEvents;
    let renderEvents;
    if (events.length === 0 || results === 0) {
        renderEvents = (
            <div className="text-lg text-center">
                No In Progress Vatsim Events
            </div>
        );
    } else {
        renderEvents = events.map((e, i) => (
            <div key={e.id}>
                <HomeVatsimEventInfoTab event={e} counter={i}/>
            </div>
        ));
    }
    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 gap-5 auto-rows-fr p-2 w-[80%] mt-3 mb-3">
                {renderEvents}
            </div>
        </div>
    );
}

export default HomeVatsimEvents;
