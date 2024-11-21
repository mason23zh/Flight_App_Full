import React from "react";

type Tabs = "airports" | "flights" | "aircraft"

interface Props {
    onTabChange: (tab: Tabs) => void;
    activeTab: Tabs;
}

const SearchBoxTabButtonGroup = ({
    onTabChange,
    activeTab
}: Props) => {

    const handleTabClick = (tab: Tabs) => {
        onTabChange(tab);
    };

    return (
        <div className="flex justify-center gap-2 border-b border-gray-400 ml-1">
            <button
                onClick={() => handleTabClick("airports")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "airports"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Airports
            </button>

            <button
                onClick={() => handleTabClick("flights")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "flights"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Flights
            </button>

            <button
                onClick={() => handleTabClick("aircraft")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "aircraft"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Aircraft
            </button>
        </div>
    );
};

export default SearchBoxTabButtonGroup;