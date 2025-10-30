"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider");
  }
  return context;
}

function getInitialDarkMode() {
  if (typeof window === "undefined") return false;
  
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) {
    return stored === "true";
  }
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    // Apply dark mode class on mount
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", newValue.toString());
      return newValue;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
