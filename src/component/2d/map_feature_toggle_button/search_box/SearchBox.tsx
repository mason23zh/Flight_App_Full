import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useTheme } from "../../../../hooks/ThemeContext";
import MapSearchInputBar from "./MapSearchInputBar";
import { searchAirports, searchVatsimTraffic } from "./mapSearchFunction";
import SearchBoxAirportDisplaySection from "./SearchBoxAirportDisplaySection";

const SearchBox = () => {
    const darkMode = useTheme();
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };


    const searchResults = useLiveQuery(
        async () => {
            const airports = await searchAirports(searchInput);
            const vatsimTraffic = await searchVatsimTraffic(searchInput);
            return {
                airports,
                vatsimTraffic
            };
        },
        [searchInput],
        {
            airports: [],
            vatsimTraffic: []
        }
    );

    return (
        <div className="absolute left-[110%] bg-red-300 min-w-[350px] rounded-lg grid grid-cols-1">
            <MapSearchInputBar
                handleChange={handleChange}
                searchInput={searchInput}
                darkMode={darkMode}/>
            <div>
                <h2>Airports</h2>
                <SearchBoxAirportDisplaySection airports={searchResults.airports}/>

                <h2>VATSIM Traffic</h2>
            </div>
        </div>
    );
};

export default SearchBox;