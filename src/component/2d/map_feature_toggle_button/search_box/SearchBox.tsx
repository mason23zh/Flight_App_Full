/*
* To render all contents returned from the Dexie DB
* The visibility of this component is controlled by SearchButton component
*
* */
import React, { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useTheme } from "../../../../hooks/ThemeContext";
import MapSearchInputBar from "./MapSearchInputBar";
import { searchAirports, searchVatsimTraffic } from "./mapSearchFunction";
import SearchBoxAirportDisplaySection from "./SearchBoxAirportDisplaySection";
import { Tabs } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import { RootState } from "../../../../store";


const SearchBox = () => {
    const darkMode = useTheme();
    const { searchBoxVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current &&
                    !searchBoxRef.current.contains(event.target as Node) &&
                    !(event.target as HTMLElement).closest("#search-button")
            ) {
                dispatch(toggleSearchBox(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dispatch, searchBoxVisible]);

    return (
        <div ref={searchBoxRef}
            className="absolute left-[110%] bg-red-300 min-w-[350px] rounded-lg grid grid-cols-1">
            <MapSearchInputBar
                handleChange={handleChange}
                searchInput={searchInput}
                darkMode={darkMode}
            />
            <div className="p-2">
                <Tabs defaultActiveKey="1">
                    <Tabs.Tab eventKey="1" title="Airports">
                        <SearchBoxAirportDisplaySection airports={searchResults.airports}/>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="2" title="Flights">
                        <div>Flights</div>
                    </Tabs.Tab>

                    <Tabs.Tab eventKey="3" title="Aircrafts">
                        <div>Aircraft</div>
                    </Tabs.Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default SearchBox;