import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toggleSearchBox } from "../../../../store";
import SearchBox from "./SearchBox";
import { Tooltip } from "react-tooltip";

interface Props {
    tooltipMessage: string;
    isTouchScreen: boolean;
}

const SearchButton = ({
    isTouchScreen,
    tooltipMessage
}: Props) => {
    const dispatch = useDispatch();
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { searchBoxVisible } = useSelector((state: RootState) => state.vatsimMapVisible);


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
                    onMouseEnter={() => setShowTooltip(false)}
                    onMouseLeave={() => setShowTooltip(true)}
                >
                    {styledIcon}
                </button>
            </div>
            {searchBoxVisible && <SearchBox/>}

            {(!isTouchScreen && !searchBoxVisible) &&
                <Tooltip
                    hidden={showTooltip}
                    anchorSelect="#search-button"
                    delayShow={300}
                    place="right"
                    style={{
                        backgroundColor: "rgb(0,0,0)",
                        color: "rgb(255,255,255)",
                        fontSize: "13px",
                        padding: "5px",
                        borderRadius: "5px"
                    }}
                >
                    {tooltipMessage}
                </Tooltip>
            }
        </>
    );
};

export default SearchButton;