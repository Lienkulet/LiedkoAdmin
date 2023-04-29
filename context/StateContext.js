import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({children}) => {
    const [showNav, setShowNav] = useState(false);

    const toggleNav = () => {
        setShowNav(!showNav);
    }

    return (
        <Context.Provider value={{
            showNav,
            setShowNav,
            toggleNav
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);