import { useMemo, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";

function ScrollToHashElement() {
    // const location = useLocation();
    const location = usePathname()
    
    const hashElement = useMemo(() => {
        // const { hash } = location;
        // const hash = location
        
        console.log(location);
        

        // const removeHashCharacter = (str) => {
        //     const result = str.slice(1);
        //     return result;
        // };
        
        // if (hash) {
        //     const element = document.getElementById(removeHashCharacter(hash));
        //     return element;
        // } 
        // return null;
    }, [location]);
    
    useEffect(() => {
        if (hashElement) {
            hashElement.scrollIntoView({
                behavior: "smooth",
                // block: "end",
                inline: "nearest",
            });
        }
    }, [hashElement]);
    
    return null;
}

export default ScrollToHashElement;
