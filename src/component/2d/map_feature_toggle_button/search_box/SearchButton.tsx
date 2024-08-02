import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { toggleSearchBox } from "../../../../store/slices/vatsimMapVisibleSlice";
import SearchBox from "./SearchBox";
import MapFeaturesToggleButtonGroup from "../MapFeaturesToggleButtonGroup";

interface Props {
    tooltipMessage: string;
    isTouchScreen: boolean;
}

//TODO: Missing tooltip
//TODO: Search box not close when other tool panel open

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

    const handleClick = () => {
        dispatch(toggleSearchBox(!searchBoxVisible));
    };

    const activeButtonClass = searchBoxVisible ? activeClass : inActiveClass;

    return (
        <>
            <div className="relative">
                <button
                    id="search-button"
                    className={activeButtonClass}
                    onClick={handleClick}
                >
                    {styledIcon}
                </button>
            </div>
            {searchBoxVisible && <SearchBox visible={searchBoxVisible}/>}
        </>
    );
};

export default SearchButton;