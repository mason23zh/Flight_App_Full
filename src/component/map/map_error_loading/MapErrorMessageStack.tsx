// To display error notification message in stack instead of overlapping

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const MapErrorMessageStack = () => {
    const { messages } = useSelector((state: RootState) => state.vatsimMapError);

    return (
        <div
            className="fixed top-[70px] right-[10px] sm:right-[20px]
                md:right-[30px] lg:right-[50px] z-50 w-auto"
        >
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