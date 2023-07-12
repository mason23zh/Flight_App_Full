import React from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import AirportDisplay from "./AirportDisplay";
import AirportAccordion from "./AirportAccordion";
import PaginationCustom from "./PaginationCustom";


function AirportsList({ airports }) {
    const { data } = airports;
    console.log(data);
    const renderedAirports = data.airports.map((airport) => (
        <div key={airport.ICAO}>
            <AirportAccordion airport={airport} />
        </div>
    ));
    
    const showGoToPage = (page) => {
        console.log("GO TO PAGE", page);
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col gap-4 p-10 items-center ">{renderedAirports}</div>
            <PaginationCustom
                className="w-auto flex justify-center"
                currentPage={data.page}
                totalCount={data.totalAirports}
                pageSize={data.limit}
                onPageChange={(page) => showGoToPage(page)}
            />
        </div>
    );
}

export default AirportsList;
