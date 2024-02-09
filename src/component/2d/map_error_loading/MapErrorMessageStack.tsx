// To display error notification message in stack instead of overlapping

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const MapErrorMessageStack = () => {
    const { messages } = useSelector((state: RootState) => state.vatsimMapError);
    console.log("Map error message stack message:", messages);

    return (
        <div className="fixed top-50 left-50 z-50 w-auto">
            {messages.map((message, index) => (
                <div key={index} className="m-1">
                    <div className="bg-black text-white p-2 rounded-md animate-fade">
                        {message.payload.content}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MapErrorMessageStack;