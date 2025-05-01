import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Added userId state
  const [driverId, setDriverId] = useState(null); // Added driverId state
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setUserId(storedUser ? JSON.parse(storedUser).uid : null);
  }, []);

  return (
    <AppContext.Provider value={{ userType, setUserType, isLoggedIn, setIsLoggedIn, userId, setUserId, driverId, setDriverId, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};