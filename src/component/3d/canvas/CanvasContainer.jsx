/* eslint-disable react/destructuring-assignment */
import { Suspense, React } from "react";
import { Canvas } from "@react-three/fiber";

function CanvasContainer(props) {
    return (
        <div className="">
            <div className="w-screen h-screen">
                <Canvas>
                    <Suspense fallback={null}>
                        {props.children}
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}

export default CanvasContainer;
