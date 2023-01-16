import React, { useState } from "react";

export const SidebarContext = React.createContext();

export default function SidebarProvider({ children }) {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarIsOpen(!sidebarIsOpen)
  };

  const setToggleSidebar = (e) => {
    setSidebarIsOpen(e);
  };

  return (
    <SidebarContext.Provider value={{ toggleSidebar, sidebarIsOpen, setToggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}