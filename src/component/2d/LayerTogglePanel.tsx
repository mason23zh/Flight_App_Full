import React from "react";
import { IoAirplane } from "react-icons/io5";
import { AiFillTags } from "react-icons/ai";
import { FaSatellite } from "react-icons/fa";

import { Toggle } from "rsuite";

const LayerTogglePanel = ({
    onChangeTraffic,
    onChangeLabel,
    onChangeSatellite
}) => {
    const handleOnChangeTraffic = (e: boolean) => {
        onChangeTraffic(e);
    };

    const handleOnChangeLabel = (e: boolean) => {
        onChangeLabel(e);
    };

    const handleOnChangeSatellite = (e: boolean) => {
        onChangeSatellite(e);
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
                        onChange={(checked) => handleOnChangeTraffic(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked
                        checkedChildren={<AiFillTags/>}
                        unCheckedChildren={<AiFillTags/>}
                        onChange={(checked) => handleOnChangeLabel(checked)}
                    />
                </div>
                <div className="py-1 px-2">
                    <Toggle
                        size="md"
                        defaultChecked={false}
                        checkedChildren={<FaSatellite/>}
                        unCheckedChildren={<FaSatellite/>}
                        onChange={(checked) => handleOnChangeSatellite(checked)}
                    />
                </div>
            </div>
        </div>
    );
};

export default LayerTogglePanel;