/* eslint-disable react/no-unknown-property */
import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import EarthDayMap from "../../../assets/textures/8k_earth_daymap.jpg";
import EarthNormalMap from "../../../assets/textures/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../../../assets/textures/8k_earth_specular_map.jpg";
import EarthCloudsMap from "../../../assets/textures/8k_earth_clouds.jpg";

export function Earth(props) {
    // load textures
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
        TextureLoader,
        [EarthDayMap, EarthNormalMap, EarthSpecularMap, EarthCloudsMap],
    );
    
    return (
        <>
            <ambientLight intensity={1.0} />
            {/* Cloud Mesh */}
            <mesh>
                <sphereGeometry args={[1.004, 32, 32]} />
                <meshPhongMaterial
                    map={cloudsMap}
                    opacity={0.4}
                    depthWrite
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Earth Mesh */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} />
                <OrbitControls
                    enableZoom
                    enablePan
                    enableRotate
                    zoomSpeed={0.6}
                    rotateSpeed={0.4}
                />
            </mesh>
        </>
    );
}
 
