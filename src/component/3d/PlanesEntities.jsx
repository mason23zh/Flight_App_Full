/* eslint-disable react/destructuring-assignment */
import React from "react";
import {
    Entity, Model, ModelGraphics, PointGraphics,
} from "resium";
import { Cartesian3, Color } from "cesium";
import b738Model from "../../assets/models/b738.gltf";
import b738Model2 from "../../assets/models/b738.glb";

function PlanesEntities({ pilots }) {
    let generateEntity;
    if (pilots && pilots.length > 0) {
        generateEntity = pilots.map((p) => {
            if (p.latitude && p.longitude && p.heading && p.altitude && p.heading) {
                const position = Cartesian3.fromDegrees(p.longitude, p.latitude, Number(p.altitude) * 0.3048);
                return (
                    <Entity position={position} name={p.callsign} key={p.callsign}>
                        {/* <ModelGraphics url="../../assets/models/b738.glb" scale={2} minimumPixelSize={128} show /> */}
                        <PointGraphics pixelSize={10} color={Color.RED} />
                    </Entity>
                );
            }
            return null;
        });
    }
    
    return (
        <div>
            {generateEntity}
        </div>
    );
}

export default PlanesEntities;
