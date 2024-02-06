import React from "react";

const ErrorLoadingMsg = ({ message }) => {
    return <div
        className="fixed top-50 left-50 z-50 w-auto h-auto flex items-center justify-center bg-opacity-50 bg-black text-white">
        {message}
    </div>;
};

export default ErrorLoadingMsg;