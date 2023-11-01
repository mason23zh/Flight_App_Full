import React, { useEffect, useState } from "react";
import axios from "axios";

function VatsimEventSection() {
    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        const requestVatsimEvents = async () => {
            const response = await axios.get("https://my.vatsim.net/api/v1/events/all");
            if (response) {
                console.log(response);
            }
        };
        requestVatsimEvents();
    }, []);
    return (
        <div>
            VATSIM EVENT SECTION
        </div>
    );
}

export default VatsimEventSection;
