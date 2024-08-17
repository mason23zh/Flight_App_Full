import { MVTLayer } from "@deck.gl/geo-layers";

const tileURL = "https://api.mapbox.com/v4/mason-zh.clqudy2fp2ag61nogduw0ofwr-96of0/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoibWFzb24temgiLCJhIjoiY2xweDcyZGFlMDdmbTJscXR1NndoZHlhZyJ9.bbbDy93rmFT6ppFe00o3DA";


const firTileLayer = new MVTLayer({
    id: "fir-boundaries",
    data: tileURL,
    minZoom: 0,
    maxZoom: 30,
    // stroked: true,
    // getLineColor: feature => {
    //     return feature.properties.id === "ZLLL" ? [255, 0, 0] : [200, 200, 200];
    // },
    getLineColor: feature => {
        console.log(feature);
        return [148, 158, 163];
    },
    getFillColor: [0, 0, 0, 0],
    lineWidthMinPixels: 1,
    pickable: false,
});

export const activeAndSelectedFirLayer = new MVTLayer({
    id: "active-and-selected-fir-boundaries",
    data: tileURL,
    minZoom: 0,
    maxZoom: 30,

});


export default firTileLayer;