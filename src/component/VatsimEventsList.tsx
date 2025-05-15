import { useEffect, useState } from "react";
import _ from "lodash";
import VatsimEventsListItem from "./VatsimEventsListItem";
import { useTheme } from "../hooks/ThemeContext";
import { EventResponse } from "../store/apis/vatsimApi";
import { Virtuoso } from "react-virtuoso";

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
                totalCount={allEvents.result}
                style={{ height: "100%" }}
                className={scrollBarStyle}
                itemContent={(_, event) => (
                    <div className="px-2 py-1">
                        <VatsimEventsListItem
                            event={event}
                            onClick={handleClick}
                        />
                    </div>
                )}
            />
        </div>
    );

}

export default VatsimEventsList;