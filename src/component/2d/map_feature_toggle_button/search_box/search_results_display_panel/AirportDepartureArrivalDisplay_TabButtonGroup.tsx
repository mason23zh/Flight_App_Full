import React, { useState } from "react";

type Tabs = "arrival" | "departure" | "info"
//TODO: add departure and arrival traffic number
const AirportDepartureArrivalDisplayTabButtonGroup = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState("departure"); // Track the active tab

    const handleTabClick = (tab: Tabs) => {
        setActiveTab(tab);
        onTabChange(tab); // Notify parent of tab change
    };

    return (
        <div className="flex justify-start gap-2 border-b border-gray-400 ml-1">
            {/* Departure Tab */}
            <button
                onClick={() => handleTabClick("departure")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "departure"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Departure
            </button>

            {/* Arrival Tab */}
            <button
                onClick={() => handleTabClick("arrival")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "arrival"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Arrival
            </button>

            {/* Info Tab */}
            <button
                onClick={() => handleTabClick("info")}
                className={`px-4 py-2 rounded-t-md border-b-2 transition-colors ${
                    activeTab === "info"
                        ? "bg-gray-700 text-white border-blue-500"
                        : "bg-gray-500 text-gray-300 border-transparent hover:bg-gray-600"
                }`}
            >
                Info
            </button>
        </div>
    );
};

export default AirportDepartureArrivalDisplayTabButtonGroup;