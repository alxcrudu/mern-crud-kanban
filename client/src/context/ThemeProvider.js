import React, { useState, useEffect } from "react";

export const ThemeContext = React.createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("");
  const doc = document.documentElement;

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)")) {
      setTheme("dark");
      doc.classList.add("dark");
    } else {
      setTheme("light");
      doc.classList.add("light");
    }
  }, []); //eslint-disable-line

  const toggleTheme = () => {
    if (theme === "dark") {
      doc.classList.remove("dark");
      doc.classList.add("light");
      setTheme("light");
    } else {
      doc.classList.add("dark");
      doc.classList.remove("light");
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}