"use client";

import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext(undefined);

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const localValue = localStorage.getItem("darkmode");
      return localValue ? JSON.parse(localValue) : false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark === undefined) {
      return;
    }
    localStorage.setItem("darkmode", JSON.stringify(isDark));

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
