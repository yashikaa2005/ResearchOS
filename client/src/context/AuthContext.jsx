// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  register as registerService,
  login as loginService,
  getCurrentUser,
  logout as logoutService,
} from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); //stores logged in user
  const [token, setToken] = useState(localStorage.getItem("token") || null); //stores JWT
  const [loading, setLoading] = useState(true); //checks if user logged in

  const fetchCurrentUser = async (authToken) => {
    try {
      const data = await getCurrentUser(authToken);
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (data) => {
    const result = await registerService(data);
    if (result.success) {
    const token = result.data.token;
    localStorage.setItem("token", token);
    setToken(token);
    await fetchCurrentUser(token);
}
    return result;
  };

  const login = async (data) => {
    const result = await loginService(data);
    if(result.success){
    const token = result.data.token; //return token
    localStorage.setItem("token", token); //localstorage
    setToken(token);
    await fetchCurrentUser(token);
}
    return result;
  };

  const logout = () => {
    logoutService();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);