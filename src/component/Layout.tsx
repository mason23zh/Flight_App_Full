import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
    const location = useLocation();
    const showFooter = location.pathname !== "/map";
    // const showFooter = true;

    return (
        <div className="flex flex-col h-screen-dvh">
            <header id="header" className="h-auto">
                <Navbar/>
            </header>
            <main className="flex flex-grow flex-col justify-between">
                <Outlet/>
            </main>
            {showFooter &&
                <footer id="footer" className="h-auto">
                    <Footer/>
                </footer>
            }
        </div>

    );
}

export default Layout;
