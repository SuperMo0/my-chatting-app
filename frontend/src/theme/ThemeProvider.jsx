import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        if (dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);

    const value = useMemo(
        () => ({
            dark,
            setDark,
            toggleDark: () => setDark((prev) => !prev),
        }),
        [dark]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
