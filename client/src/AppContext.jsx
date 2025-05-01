import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Added userId state
  const [driverId, setDriverId] = useState(null); // Added driverId state

  return (
    <AppContext.Provider value={{ userType, setUserType, isLoggedIn, setIsLoggedIn, userId, setUserId, driverId, setDriverId }}>
      {children}
    </AppContext.Provider>
  );
};