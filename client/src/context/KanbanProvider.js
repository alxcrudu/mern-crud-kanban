import React, { useState } from "react";

export const KanbanContext = React.createContext();

export default function KanbanProvider({ children }) {
  const [user, setUserr] = useState({});
  const [favouriteList, setFavouriteListt] = useState([]);
  const [boards, setBoardss] = useState([]);

  const setUser = props => {
    setUserr(props);
  };
  const setFavouriteList = props => {
    setFavouriteListt(props);
  };
  const setBoards = props => {
    setBoardss(props);
  };
  
  return (
    <KanbanContext.Provider value={{
      user,
      favouriteList,
      boards,
      setUser, 
      setFavouriteList, 
      setBoards
    }}>
      {children}
    </KanbanContext.Provider>
  )
};
