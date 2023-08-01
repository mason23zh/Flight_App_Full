import React from "react";
import notFoundImg from "../images/404.png";

function NoMatch() {
    return (
        <div className="bg-gray-100 h-screen">
            <div className="flex flex-col items-center gap-5">
                <div className="text-xl">404 Not Found</div>
                <div className="h-[600px] w-[400px]">
                    <img src={notFoundImg} alt="Orion Not Found" />
                </div>
            </div>
        </div>
    );
}

export default NoMatch;
