import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    const currentLocation = useLocation();
    return (
        <div>
            <div className="font-Rubik flex flex-col h-screen justify-between">
                <div className="h-15">
                    <Navbar />
                </div>
                <div className="mb-auto">
                    <Outlet />
                </div>
                <div className="h-10">
                    {/* Stop showing Footer component in the Home page */}
                    {currentLocation.pathname !== "/" && <Footer />}
                </div>
            </div>
        </div>
    );
}

export default Layout;
