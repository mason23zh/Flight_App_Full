import { MVTLayer } from "@deck.gl/geo-layers";

const tileURL =
    "https://api.mapbox.com/v4/mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";

const selectedFirLayer = (matchedFirIds: string[]) => {
    const activeAndSelectedFirLayer = new MVTLayer({
        id: "active-and-selected-fir-boundaries",
        data: tileURL,
        minZoom: 0,
        maxZoom: 30,
        getLineColor: (feature) => {
            return matchedFirIds.includes(feature.properties.id)
                ? [148, 153, 168] // Highlight color
                : [0, 0, 0];
        },
        getFillColor: (feature) => {
            return matchedFirIds.includes(feature.properties.id)
                ? [148, 153, 168, 90] // Highlight color
                : [0, 0, 0, 0]; // Default color
        },
        lineWidthMinPixels: 2.0,
    });

    return activeAndSelectedFirLayer;
};

export default selectedFirLayer;
