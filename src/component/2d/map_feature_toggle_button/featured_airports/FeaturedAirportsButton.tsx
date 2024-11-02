import React, { useState } from "react";
import { IoStar } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { RootState, toggleFeaturedAirports } from "../../../../store";
import { useDispatch, useSelector } from "react-redux";

interface Props {
    isTouchScreen: boolean;
    tooltipMessage: string;
}

const FeaturedAirportsButton = ({
    isTouchScreen,
    tooltipMessage
}: Props) => {
    const dispatch = useDispatch();
    const { featuredAirportsVisible } = useSelector((state: RootState) => state.vatsimMapVisible);
    // const [featuredAirportsVisible, setFeaturedAirportsVisible] = useState(false);

    const activeClass = isTouchScreen ?
        "bg-blue-500 px-2 py-1 items-center rounded-lg text-yellow-400 text-xl" :
        "bg-blue-500 px-2 py-1 items-center rounded-lg hover:bg-blue-400 text-yellow-400 text-xl";
    const inActiveClass = isTouchScreen ?
        "bg-gray-500 px-2 py-1 items-center rounded-lg text-yellow-400 text-xl" :
        "bg-gray-500 px-2 py-1 items-center rounded-lg hover:bg-gray-400 text-yellow-400 text-xl";

    const activeButtonClass = featuredAirportsVisible ? activeClass : inActiveClass;

    const handleClick = () => {
        const localState = !featuredAirportsVisible;
        // setFeaturedAirportsVisible(prevState => !prevState);
        dispatch(toggleFeaturedAirports(localState));
    };

    console.log("featured airports visible:", featuredAirportsVisible);

    return (
        <>
            <div className="relative">
                <button
                    id="featured-airports-button"
                    className={activeButtonClass}
                    onClick={handleClick}
                >
                    <IoStar/>
                </button>
            </div>

            {(!isTouchScreen) &&
                <Tooltip
                    anchorSelect="#featured-airports-button"
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

export default FeaturedAirportsButton;