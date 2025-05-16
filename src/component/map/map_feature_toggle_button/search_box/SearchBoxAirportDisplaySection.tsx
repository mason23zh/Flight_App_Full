import SearchBoxAirportElement from "./SearchBoxAirportElement";
import { LocalDbAirport } from "../../../../types";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../../../../util/VirtuosoScroller";

interface Props {
    airports: LocalDbAirport[];
}

/*
 * This component will render list of airports in the search box
 * */

const SearchBoxAirportDisplaySection = ({ airports }: Props) => {
    if (airports.length === 0) {
        return <div>No Matched Airport</div>;
    }

    return (
        <div className="flex-1 h-full">
            <Virtuoso
                data={airports}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, airport) => <SearchBoxAirportElement airport={airport} />}
            />
        </div>
    );
};

export default SearchBoxAirportDisplaySection;
