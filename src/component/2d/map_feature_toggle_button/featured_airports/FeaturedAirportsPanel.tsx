import React from "react";
import { useFetchVatsimPopularAirportsQuery } from "../../../../store";
import FeaturedAirportsList from "./FeaturedAirportsList";

const FeaturedAirportsPanel = () => {
    const {
        data,
        error,
        isFetching,
    } = useFetchVatsimPopularAirportsQuery({ limit: 11 }, { refetchOnMountOrArgChange: true });


    let featuredAirportList;
    if (data) {
        featuredAirportList = <FeaturedAirportsList featuredAirportsList={data}/>;
    } else if (isFetching) {
        featuredAirportList = <div>Loading data</div>;
    } else if (error) {
        featuredAirportList = <div>Failed to load data</div>;
    }

    const wrapperStyle = "fixed z-[200] top-5 sm:top-16 left-1/2 transform -translate-x-1/2" +
            " w-[19rem] sm:w-[22rem] max-w-[90%] sm:left-16 sm:right-auto sm:translate-x-0 sm:translate-y-[5%] " +
            "bottom-10 max-h-[40rem] min-h-[15rem]";

    return (
        <div className={wrapperStyle}>
            <div className="flex flex-col h-[90%] bg-gray-500 text-white rounded-lg overflow-hidden">
                <div className="text-center text-lg p-2 border-b border-gray-400 font-bold">
                    Popular Vatsim Airports
                </div>

                {featuredAirportList}
            </div>
        </div>
    );
};

export default FeaturedAirportsPanel;