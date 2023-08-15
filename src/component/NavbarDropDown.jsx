import React from "react";
import Dropdown from "rsuite/Dropdown";
import { Link } from "react-router-dom";
import { IoListOutline } from "react-icons/io5";

function NavbarDropDown() {
    return (
        <div>
            <Dropdown title={<IoListOutline />} noCaret>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/airport">Airport</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/weather">Weather</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/extreme-weather" className="text-red-400">
                        Extreme weather
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link style={{ textDecoration: "none" }} to="/about">About</Link>
                </Dropdown.Item>
            </Dropdown>
        </div>
    );
}

export default NavbarDropDown;
