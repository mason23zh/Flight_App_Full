import React from "react";
import { PopularVatsimAirportResponse } from "../../../../store/apis/airportsApi";
import FeaturedAirportElement from "./FeaturedAirportElement";
import { Virtuoso } from "react-virtuoso";
import Scroller from "../../../../util/VirtuosoScroller";


interface Props {
    featuredAirportsList: PopularVatsimAirportResponse;
}

const FeaturedAirportsList = ({ featuredAirportsList }: Props) => {

    if (!featuredAirportsList.data || featuredAirportsList.data?.airports.length === 0) {
        return <div>No Vatsim Controllers</div>;
    }

    //test for rtkQuery cache
    console.log("featured airport list length:", featuredAirportsList.data.airports.length);

    return (
        <div className="flex-1 h-full">
            <Virtuoso
                data={featuredAirportsList.data.airports}
                style={{ height: "100%" }}
                components={{ Scroller }}
                itemContent={(_, airport) => (
                    <FeaturedAirportElement
                        featuredAirport={airport}
                    />
                )}
            />
        </div>
    );
};

export default FeaturedAirportsList;