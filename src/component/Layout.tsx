import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div>
            <div className="font-Rubik flex flex-col h-screen justify-between">
                <div className="h-15">
                    <Navbar/>
                </div>
                <div className="mb-auto">
                    <Outlet/>
                </div>
                <div className="h-10">
                    <Footer/>
                </div>
            </div>
        </div>
    );
}

export default Layout;
