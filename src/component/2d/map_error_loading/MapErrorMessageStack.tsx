// To display error notification message in stack instead of overlapping

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../../../store";
import { RootState } from "../../../store";

const MapErrorMessageStack = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector((state: RootState) => state.vatsimMapError);

    useEffect(() => {
        const timer = setTimeout(() => {
            messages.forEach((_, index) => dispatch(removeMessage(index)));
        }, 1000);

        return () => clearTimeout(timer);
    }, [messages, dispatch]);

    return (
        <div className="fixed top-50 left-50 z-50 w-auto">
            {messages.map((message, index) => (
                <div key={index} className="m-1">
                    <div className="bg-opacity-50 bg-black text-white p-4 rounded-md shadow-md">
                        {message}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MapErrorMessageStack;