import React, { createContext, useState, useContext, useEffect } from 'react'
import { assets } from '../Components/Assets/assets';


const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const bgd = theme === 'light' ? assets.chatbg1 : assets.darkChat;

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, bgd }}>
            {children}
        </ThemeContext.Provider>
    );
};