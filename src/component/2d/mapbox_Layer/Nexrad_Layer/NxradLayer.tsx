import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layer, Source } from "react-map-gl";
import { nexradLayerStyle } from "./nexradMapStyle";

const NexradLayer = ({ labelVisible }) => {
    const [rasterTimeStamp, setRasterTimeStamp] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const tsData = await axios.get("https://tilecache.rainviewer.com/api/maps.json");
            if (tsData.data) {
                setRasterTimeStamp(tsData.data[0]);
            }

        };
        fetchData()
            .then()
            .catch();
    }, []);

    if (rasterTimeStamp && labelVisible) {
        return (
            <Source
                id={"nexrad-source"}
                type="raster"
                tiles={[`https://tilecache.rainviewer.com/v2/radar/${rasterTimeStamp}/512/{z}/{x}/{y}/6/0_1.png`]}
                tileSize={256}
            >
                <Layer {...nexradLayerStyle}/>
            </Source>
        );
    }
};

export default NexradLayer;