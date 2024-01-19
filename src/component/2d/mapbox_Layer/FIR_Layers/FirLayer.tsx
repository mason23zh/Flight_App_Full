import React, { useEffect, useState } from "react";
import { Layer, MapRef } from "react-map-gl";
import { VatsimControllers } from "../../../../types";

interface Controller {
    controllerInfo: VatsimControllers;
    hoverFir: any;
}

const FirLayer = ({
    controllerInfo,
    hoverFir
}: Controller) => {
    console.log("FIR layer render");
    const [filter, setFilter] = useState([]);

    const hoverFilter = ["==", ["get", "id"], hoverFir ? hoverFir : ""];

    useEffect(() => {
        if (hoverFir) {
            console.log("HOVER ID:", hoverFir);
        }
        if (controllerInfo && controllerInfo.fir.length > 0) {
            const firArray = ["in", "id"];
            controllerInfo.fir.forEach((c) => {
                const fir = c.fir;
                //! EDDM FIR won't render
                // if (c.callsign.split("_").length === 3) {
                //     const prefix = c.callsign.split("_")[1];
                //     if (isNaN(+prefix)) {
                //         fir = c.fir + "-" + c.callsign.split("_")[1];
                //     }
                // }
                firArray.push(fir);
            });
            console.log("fir array:", firArray);
            setFilter(firArray);
        }
    }, [controllerInfo, hoverFir]);


    if (filter.length > 2) {
        return (
            <Layer
                type="fill"
                source="fir-boundary-source"
                source-layer="firboundaries"
                id="firs"
                filter={filter}
                paint={{
                    "fill-outline-color": "rgb(255,255,255)",
                    "fill-color": ["case",
                        hoverFilter,
                        "rgba(100, 100, 211, 0.351)", // Color when hovered
                        "rgba(230, 230, 211, 0.351)"  // Default color
                    ],
                    "fill-opacity": 0.8
                }}
                // paint={{
                //     "fill-outline-color": "rgb(255,255,255)",
                //     "fill-color": "rgba(230, 230, 211, 0.351)",
                //     "fill-opacity": 0.8
                // }}
                //paint={paintFill}
            />
        );
    }
};

// const FirLayer = ({ controllerInfo }: Controller) => {
//     const [filter, setFilter] = useState([]);
//     const [hoveredFir, setHoveredFir] = useState(null);
//
//     useEffect(() => {
//         if (controllerInfo && controllerInfo.fir.length > 0) {
//             const firArray = ["in", "id"];
//             controllerInfo.fir.forEach((c) => {
//                 let fir = c.fir;
//                 if (c.callsign.split("_").length === 3) {
//                     const prefix = c.callsign.split("_")[1];
//                     if (isNaN(+prefix)) {
//                         fir = c.fir + "-" + c.callsign.split("_")[1];
//                     }
//                 }
//                 firArray.push(fir);
//             });
//             setFilter(firArray);
//         }
//     }, [controllerInfo]);
//
//     const onHover = (e) => {
//         const firId = e.features && e.features[0] && e.features[0].properties.id;
//         setHoveredFir(firId);
//     };
//
//     const paintFill = {
//         "fill-outline-color": "rgb(255,255,255)",
//         "fill-color": hoveredFir ? "rgba(100, 100, 211, 0.351)" : "rgba(230, 230, 211, 0.351)",
//         "fill-opacity": 0.8
//     };
//
//     if (filter.length > 2) {
//         return (
//             <>
//                 <Layer
//                     type="fill"
//                     source="fir-boundary-source"
//                     source-layer="firboundaries"
//                     id="firs"
//                     filter={filter}
//                     paint={paintFill}
//                 />
//                 {/* Label Layer */}
//                 <Layer
//                     id="fir-labels"
//                     type="symbol"
//                     source="fir-boundary-source"
//                     source-layer="firboundaries"
//                     layout={{
//                         "text-field": "{id}", // Assuming 'id' contains the FIR's callsign
//                         "text-size": 12,
//                     }}
//                     paint={{
//                         "text-color": "#FFFFFF",
//                     }}
//                     onHover={onHover}
//                 />
//             </>
//         );
//     } else {
//         return null;
//     }
// };

export default React.memo(FirLayer);
