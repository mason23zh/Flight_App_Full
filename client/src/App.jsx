import {useEffect} from "react";
import connectTest from "./api";

const App = () => {
    useEffect(() => {
        connectTest()
            .catch(e => console.error(e))
    }, [])
    return (
        <div>
            App
        </div>
    )
}

export default App;