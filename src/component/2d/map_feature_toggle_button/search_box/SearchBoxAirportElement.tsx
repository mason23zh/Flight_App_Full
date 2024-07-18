import React, { useEffect, useRef } from "react";
import { LocalDbAirport } from "../../../../types";
import { useDispatch } from "react-redux";
import { setAirportDepartureArrivalDisplay, setMapSearchSelectedAirport } from "../../../../store";

interface Props {
    airport: LocalDbAirport;
    setRowHeight: (index: number, size: number) => void; //to send back the height to parent component
    index: number;
}


const SearchBoxAirportElement = ({
    airport,
    setRowHeight,
    index
}: Props) => {
    const dispatch = useDispatch();

    const rowRef = useRef<HTMLDivElement>();
    useEffect(() => {
        if (rowRef.current) {
            setRowHeight(index, rowRef.current.getBoundingClientRect().height);
        }
    }, []);

    const handleOnClick = () => {
        dispatch(setMapSearchSelectedAirport(airport));
        dispatch(setAirportDepartureArrivalDisplay(true));
    };

    return (
        <>
            <div
                onClick={handleOnClick}
                ref={rowRef}
                className="p-2 grid grid-rows-2 hover:cursor-pointer
                       hover:bg-gray-600 hover:rounded-lg border-b
                       border-slate-400"
            >
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
        </>
    );
};

export default SearchBoxAirportElement;