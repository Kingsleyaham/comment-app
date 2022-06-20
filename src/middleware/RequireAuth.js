import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  const auth = useAuth();

  return auth.username ? children : <Navigate to="/" />;
};
