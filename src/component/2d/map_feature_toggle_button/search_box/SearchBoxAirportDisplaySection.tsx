import React from "react";
import SearchBoxAirportElement from "./SearchBoxAirportElement";
import { LocalDbAirport } from "../../../../types";

interface Props {
    airports: LocalDbAirport[];
}

const SearchBoxAirportDisplaySection = ({ airports }: Props) => {
    if (airports.length === 0) {
        return (
            <div>
                No Matched Airport
            </div>
        );
    } else {
        return (
            <div>
                {
                    airports.map((airport) => {
                        return (
                            <div key={airport.ident}>
                                <SearchBoxAirportElement airport={airport}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
};

export default SearchBoxAirportDisplaySection;