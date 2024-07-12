import React from "react";
import { LocalDbAirport } from "../../../../types";

interface Props {
    airport: LocalDbAirport;
}


const SearchBoxAirportElement = ({ airport }: Props) => {
    return (
        <div className="p-2 grid grid-rows-2 hover:cursor-pointer
        hover:bg-gray-600 hover:rounded-lg border-b border-slate-400">
            <div className="flex items-center text-[16px] font-Rubik">
                <div>
                    {airport.ident}
                </div>
                {
                    airport.iata_code && (
                        <div>
                                        &nbsp;/&nbsp;{airport.iata_code}
                        </div>
                    )
                }
            </div>
            <div className="text-sm w-auto">
                {airport.name && <div>{airport.name}</div>}
            </div>
        </div>
    );
};

export default SearchBoxAirportElement;