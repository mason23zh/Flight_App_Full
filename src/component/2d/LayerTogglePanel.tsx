import React from "react";
import { IoAirplane } from "react-icons/io5";
import { AiFillTags } from "react-icons/ai";
import { Toggle } from "rsuite";

const LayerTogglePanel = ({ onChange }) => {
    const handleOnChange = (e: boolean) => {
        onChange(e);
    };


    return (
        <div className="bg-gray-400 opacity-50 px-2 py-1
        z-1 absolute bottom-5 right-[50%] m-[12px] rounded-xl
        hover:opacity-90
        ">
            <div className="flex items-center gap-4">
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<IoAirplane/>}
                        unCheckedChildren={<IoAirplane/>}
                        onChange={(checked) => handleOnChange(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<AiFillTags/>}
                        unCheckedChildren={<AiFillTags/>}
                    />
                </div>
            </div>
        </div>
    );
};

export default LayerTogglePanel;