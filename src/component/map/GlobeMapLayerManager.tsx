/**
 * This component is to control if other Globe projection layers should be loaded
 * **/

import { MatchedFir } from "../../hooks/useMatchedFirs";
import { FallbackTracon, MatchedTracon } from "../../hooks/useMatchTracon";
import { VatsimControllers } from "../../types";
import { useMap } from "react-map-gl";
import GlobeFirIconLayer from "./globe_projection/Fir_Icon_Layer/GlobeFirIconLayer";
import GlobeTraconIconLayer_Test from "./globe_projection/Tracon_Icon_Layer/GlobeTraconIconLayer_Test";
import GlobeControllerIconLayer from "./globe_projection/Controller_Icon_Layer/GlobeControllerIconLayer";
import VatsimTrafficPathLayer from "./globe_projection/Vatsim_Traffic_Path_Layer/VatsimTrafficPathLayer";
import VatsimTrafficLayer from "./globe_projection/Vatsim_Traffic_Layer/VatsimTrafficLayer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useGlobeLayerOrdering } from "../../hooks/useGlobeLayerOrdering";

interface Props {
    matchedFirs: MatchedFir[];
    errorMatchedFirs: boolean;
    matchedTracons: MatchedTracon[];
    matchedFallbackTracons: FallbackTracon[];
    isTraconLoading: boolean;
    isTraconError: boolean;
    controllerData: VatsimControllers;
}

const GlobeMapLayerManager = ({
    matchedFirs,
    errorMatchedFirs,
    matchedTracons,
    matchedFallbackTracons,
    isTraconLoading,
    isTraconError,
    controllerData,
}: Props) => {
    const { mapProjection } = useSelector((state: RootState) => state.vatsimMapVisible);
    const { current: mapRef } = useMap();

    useGlobeLayerOrdering(mapRef.getMap());

    return (
        <>
            {mapProjection === "globe" && (
                <>
                    <GlobeFirIconLayer
                        matchedFirs={matchedFirs}
                        errorMatchedFirs={errorMatchedFirs}
                    />
                    <GlobeTraconIconLayer_Test
                        matchedTracons={matchedTracons}
                        matchedFallbackTracons={matchedFallbackTracons}
                        isTraconLoading={isTraconLoading}
                        isTraconError={isTraconError}
                    />
                    <GlobeControllerIconLayer controllerData={controllerData} />
                    <VatsimTrafficPathLayer key="vatsimTrafficPathLayer" />
                    <VatsimTrafficLayer key="vatsimTrafficLayer" />
                </>
            )}
        </>
    );
};

export default GlobeMapLayerManager;
