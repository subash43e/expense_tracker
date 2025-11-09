"use client";

import { useEffect, useState } from "react";

export function useDarkMode() {
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

  return { isDark, setIsDark };
}