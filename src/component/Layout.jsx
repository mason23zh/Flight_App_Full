import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <div className="font-Rubik">
            <Navbar />
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
