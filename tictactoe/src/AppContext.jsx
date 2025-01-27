import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

return <AppContext.Provider value={{name, setName, room, setRoom}}>
        {children}
    </AppContext.Provider>
}