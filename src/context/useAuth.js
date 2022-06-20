import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const authContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const login = (userDetails) => {
    setUser(userDetails);
    navigate("/comment");
  };

  const logout = () => {
    setUser({});
    navigate("/");
  };

  return (
    <authContext.Provider value={{ ...user, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};
