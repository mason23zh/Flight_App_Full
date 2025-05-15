import { Expression } from "mapbox-gl";
import { Layer } from "react-map-gl";


interface Props {
    id: string,
    filter: string[],
    textFiled: Expression,
    minzoom: number,
    allowTextOverlap: boolean,
}

const AirportLabelLayer = ({
    id,
    filter,
    textFiled,
    minzoom,
    allowTextOverlap
}: Props) => {
    return (
        <Layer
            type="symbol"
            source="gns-430-source"
            source-layer="gns_airport"
            id={id}
            filter={filter}
            minzoom={minzoom}
            layout={{
                "text-field": textFiled,
                "text-font": ["Open Sans Bold", "Arial Unicode MS Regular"],
                "text-size": 12,
                "text-offset": [0, 1.0],
                "text-anchor": "top",
                "text-allow-overlap": allowTextOverlap,
            }}
            // paint={{
            //     "text-color": "#0876ef",
            //     "text-halo-color": "#000000",
            //     "text-halo-width": 0.3,
            // }}
            paint={{
                "text-color": "#FFFFFF", // Change to white for better visibility
                "text-halo-color": "#000000", // Keep the halo color black for contrast
                "text-halo-width": 2, // Increase the halo width for better readability
            }}
        />
    );
};

export default AirportLabelLayer;