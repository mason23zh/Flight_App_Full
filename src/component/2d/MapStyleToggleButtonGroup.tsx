import React from "react";
import { Button, ButtonGroup, Popover } from "rsuite";

const MapStyleToggleButtonGroup = ({ mapRef }) => {


    return (
        <ButtonGroup block={true} vertical={true}>
            <Button>Normal</Button>
            <Button>Mono light</Button>
            <Button>MONO dark</Button>
            <Button>Sat</Button>
        </ButtonGroup>
    );
};

export default MapStyleToggleButtonGroup;