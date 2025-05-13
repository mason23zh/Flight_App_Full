import { GroupedFlight } from "../../../../types";
import SearchBoxAircraftGroup from "./SearchBoxAircraftGroup";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../../../../util/VirtuosoScroller";

interface Props {
    aircrafts: GroupedFlight[];
}

/*
* This component will render list of aircraft and number of online in the search box
* */

const SearchBoxAircraftDisplaySection = ({ aircrafts }: Props) => {
    if (aircrafts.length === 0) {
        return (
            <div>
                No Matched Aircraft
            </div>
        );
    }

    return (
        <div className="flex-1 h-full">
            <Virtuoso
                data={aircrafts}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, aircraft) => (
                    <SearchBoxAircraftGroup aircraft={aircraft} />
                )}
            />
        </div>
    );
};

export default SearchBoxAircraftDisplaySection;