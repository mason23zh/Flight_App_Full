import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import SearchBox from "./SearchBox";
import MapFeaturesToggleButtonGroup from "../MapFeaturesToggleButtonGroup";
import useDisplayTooltip from "../../../../hooks/useDisplayTooltip";

interface Props {
    tooltipMessage: string;
    isTouchScreen: boolean;
}

//TODO: Search box not close when other tool panel open

const SearchButton = ({
    isTouchScreen,
    tooltipMessage
}: Props) => {
    const dispatch = useDispatch();
    const [showSearchBox, setShowSearchBox] = useState(false);
    const { searchBoxVisible } = useSelector((state: RootState) => state.vatsimMapVisible);

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
        tooltipVisible,
        resetTooltip,
        mousePosition
    } = useDisplayTooltip(600);

    const iconClass = "text-white text-xl";
    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400";

    const styledIcon = React.cloneElement(<IoSearchSharp/>, { "className": iconClass });

    useEffect(() => {
        setShowSearchBox(searchBoxVisible);
    }, [searchBoxVisible]);

    const handleClick = () => {
        resetTooltip();
        const tempState = !showSearchBox;
        dispatch(toggleSearchBox(tempState));
        setShowSearchBox(tempState);
    };

    const activeButtonClass = searchBoxVisible ? activeClass : inActiveClass;

    return (
        <>
            <div className="relative">
                <button
                    id="search-button"
                    className={activeButtonClass}
                    onClick={handleClick}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                >
                    {styledIcon}
                </button>
            </div>
            {searchBoxVisible && <SearchBox visible={showSearchBox}/>}
            {(tooltipVisible && !isTouchScreen) &&
                <div
                    className="fixed px-2 py-1 bg-black text-white
                        text-xs rounded-md pointer-events-none z-40"
                    style={{
                        top: mousePosition.y + 15,
                        left: mousePosition.x + 15,
                    }}
                >
                    {tooltipMessage}
                </div>
            }
        </>
    );
};

export default SearchButton;