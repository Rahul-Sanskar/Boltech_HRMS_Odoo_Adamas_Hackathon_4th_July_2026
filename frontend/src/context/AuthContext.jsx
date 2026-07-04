import React, { createContext, useState, useEffect, useContext } from "react";
import { authMock } from "../services/mock/authMock";
import { profileMock } from "../services/mock/profileMock";
import { initDb } from "../services/mock/db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDb();
    const currentUser = authMock.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      profileMock.getProfile(currentUser.id)
        .then(prof => setProfile(prof))
        .catch(err => console.error("Failed to load profile", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authMock.login(email, password);
      setUser(loggedUser);
      const prof = await profileMock.getProfile(loggedUser.id);
      setProfile(prof);
      return loggedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ id, email, password, role, name }) => {
    setLoading(true);
    try {
      const registeredUser = await authMock.register({ id, email, password, role, name });
      return registeredUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authMock.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const prof = await profileMock.getProfile(user.id);
        setProfile(prof);
      } catch (error) {
        console.error("Failed to refresh profile", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
