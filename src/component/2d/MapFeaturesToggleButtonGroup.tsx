import React from "react";
import { Button, ButtonGroup } from "rsuite";

const MapFeaturesToggleButtonGroup = ({ mapRef }) => {
    return (
        <ButtonGroup block={true} vertical={true}>
            <Button>Label</Button>
            <Button>Road</Button>
            <Button>Building</Button>
        </ButtonGroup>
    );
};

export default MapFeaturesToggleButtonGroup;