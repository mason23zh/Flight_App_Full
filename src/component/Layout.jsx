import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="font-Rubik">
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
