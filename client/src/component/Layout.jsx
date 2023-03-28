import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <nav className="flex px-3 gap-3 font-bold text-lg bg-gray-500 justify-center ">
                <Link to="/">Home</Link>
                <Link to="/airport">Airport</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/about">About</Link>
            </nav>
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;