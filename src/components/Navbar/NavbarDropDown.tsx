import React from "react";
import Dropdown from "rsuite/Dropdown";
import Link from "next/link";
import { IoListOutline, IoMoon, IoSunnyOutline } from "react-icons/io5";
import { useTheme, useThemeUpdate } from "@/hooks/ThemeContext";

function NavbarDropDown() {
    const toggleTheme = useThemeUpdate();
    const darkMode = useTheme();
    
    const NavLink = React.forwardRef((props: any, ref) => {
        const { as, href, ...rest }: any= props;
        return (
            <Link legacyBehavior href={href} as={as}>
                <a ref={ref} {...rest} />
            </Link>
        )
    });
    NavLink.displayName = 'NavLink';
    
    return (
        <div>
            <Dropdown
                title={<IoListOutline size={25} />}
                placement="bottomEnd"
                noCaret
            >
                <Dropdown.Item as={NavLink} href="/airport">Airport</Dropdown.Item>
                <Dropdown.Item as={NavLink} href="/weather">Weather</Dropdown.Item>
                <Dropdown.Item as={NavLink} href="/extreme-weather" className="text-red-400">Extreme
                    weather
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} href="/about">About</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item>
                    <div
                        className="flex flex-row justify-center items-center gap-4"
                        onClick={toggleTheme}
                    >
                        <div>
                            Switch Theme
                        </div>
                        <div>{darkMode ? <IoSunnyOutline /> : <IoMoon />}</div>
                    </div>
                </Dropdown.Item>
            </Dropdown>
        </div>
    );
}

export default NavbarDropDown;
