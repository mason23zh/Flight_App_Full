import React, { useEffect, useState } from "react";

interface Props {
    autoCloseTime: number;
}

const LiveTrafficErrorNotification = ({ autoCloseTime }: Props) => {
    const [notification, setNotification] = useState(false);

    useEffect(() => {
        setNotification(true);

        const timer = setTimeout(() => {
            setNotification(false);
        }, autoCloseTime);

        return () => clearTimeout(timer);

    }, []);

    const handleCloseNotification = () => {
        setNotification(false);
    };

    console.log("Notification", notification);


    return (
        <>{(notification) &&
            <div
                className="fixed top-[70px] right-[10px] sm:right-[20px]
                md:right-[30px] lg:right-[50px] z-50 w-auto bg-red-500"
            >
                <div className="m-1">
                    <div
                        className="bg-black text-white p-2 rounded-md animate-fade"
                        onClick={handleCloseNotification}
                    >
                        Error
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default LiveTrafficErrorNotification;