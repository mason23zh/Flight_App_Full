import axios from "axios";

export const connectTest = async () => {
    const response = await axios.get("http://localhost:8001/api/v1/airports/all-airports");
    console.log(response.data.data.data);
    console.log(response.data.data.data.length);
    const airports = response.data.data.data;

    return response;
};
