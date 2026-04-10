import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type User = Tables<"users">;

interface UserContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (userId: string) => {
    const { data: user } = await supabase.from("users").select("*").eq("id", userId).single();
    if (user) {
      setCurrentUser(user);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      setIsAdmin(roles?.some(r => r.role === "admin") ?? false);
    }
  }, []);

  const login = async (userId: string) => {
    localStorage.setItem("wallet_user_id", userId);
    await fetchUser(userId);
  };

  const logout = () => {
    localStorage.removeItem("wallet_user_id");
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const refreshUser = async () => {
    if (currentUser) await fetchUser(currentUser.id);
  };

  useEffect(() => {
    const savedId = localStorage.getItem("wallet_user_id");
    if (savedId) {
      fetchUser(savedId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ currentUser, isAdmin, login, logout, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
