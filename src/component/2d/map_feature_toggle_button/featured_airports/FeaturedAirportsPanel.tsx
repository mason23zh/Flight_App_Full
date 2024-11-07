import React from "react";
import { Panel } from "rsuite";
import { useFetchVatsimPopularAirportsQuery } from "../../../../store";
import FeaturedAirportsList from "./FeaturedAirportsList";

const FeaturedAirportsPanel = () => {
    const {
        data,
        error,
        isFetching,
    } = useFetchVatsimPopularAirportsQuery({ limit: 10 });

    const panelStyle =
            "fixed left-auto right-auto top-[60px] z-50 min-w-[400px] " +
            "sm:absolute sm:left-[110%] sm:bottom-auto sm:top-[12%] " +
            "bg-gray-500 max-h-[80vh] sm:max-h-[70vh] " +
            "rounded-lg grid grid-cols-1 text-gray-100 shadow-lg overflow-y-auto ";

    let featuredAirportList;
    if (data) {
        featuredAirportList = <FeaturedAirportsList featuredAirportsList={data}/>;
    } else if (isFetching) {
        featuredAirportList = <div>Loading data</div>;
    } else if (error) {
        featuredAirportList = <div>Failed to load data</div>;
    }

    return (
        <div className={panelStyle}>
            <Panel header="Popular Vatsim Airports">
                {featuredAirportList}
            </Panel>
        </div>
    );
};

export default FeaturedAirportsPanel;