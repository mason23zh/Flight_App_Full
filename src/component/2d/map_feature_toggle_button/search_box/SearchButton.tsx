import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import SearchBox from "./SearchBox";

interface Props {
    tooltipMessage: string;
    isTouchScreen: boolean;
}

const SearchButton = ({
    isTouchScreen,
    tooltipMessage
}: Props) => {
    const dispatch = useDispatch();
    const { searchBoxVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const iconClass = "text-white text-xl";
    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";

    const styledIcon = React.cloneElement(<IoSearchSharp/>, { "className": iconClass });

    const [isActive, setIsActive] = useState(false);
    const [activeButtonClass, setActiveButtonClass] = useState(inActiveClass);
    const [buttonClick, setButtonClick] = useState(false);

    const handleClick = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        dispatch(toggleSearchBox(newActiveState));
    };

    useEffect(() => {
        setActiveButtonClass(isActive ? activeClass : inActiveClass);
    }, [isActive]);


    return (
        <>
            <div className="relative">
                <button
                    className={activeButtonClass}
                    onClick={handleClick}
                >
                    {styledIcon}
                </button>
            </div>
            {isActive && <SearchBox/>}
        </>
    );
};

export default SearchButton;