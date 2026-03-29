'use client';

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("galaxy_user");
        const savedToken = localStorage.getItem("galaxy_token");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error("Erreur de restauration de la session:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("galaxy_token", token);
    localStorage.setItem("galaxy_user", JSON.stringify(userData));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Déconnecté avec succès 👋", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    localStorage.removeItem("galaxy_token");
    localStorage.removeItem("galaxy_user");
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        showLogin,
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
