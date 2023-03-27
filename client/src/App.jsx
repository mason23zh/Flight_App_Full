import { useCallback, useEffect } from "react";
import axios from "axios";


const App = () => {
     const connectTest = useCallback(async () => {
        const response =  await axios.get('http://localhost:8001/api/v1/airports/all-airports')
        console.log(response.data.data.data);
        console.log(response.data.data.data.length);
        const airports = response.data.data.data;
        
        return response;
    }, []);

    useEffect(() => {
        connectTest()
            .catch(e => console.error(e))
    }, [connectTest])
    
    return (
        <div>
            App
        </div>
    )
}

export default App;