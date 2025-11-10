import { func } from "prop-types";

const { useContext, createContext, useState } = require("react")

function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}


function NotificationContext({ children }) {
    const notificationContext = createContext();
    const [getNotification, setNotification] = useState();




    return (
        <notificationContext.Provider value={{ getNotification, setNotification }}>
            {children}
        </notificationContext.Provider>
    )
}

export default NotificationContext;