/**
 * Hooks personalizados para React
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { UserRole } from "../types";

/**
 * Hook para gerenciar autenticação e perfil do usuário
 */
export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string): Promise<UserRole> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const raw = (data.role || "").toLowerCase();
    return raw === "admin" ? "admin" : raw === "driver" ? "driver" : null;
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData.session;

      if (!currentSession?.user?.id) {
        setSession(null);
        setRole(null);
        return;
      }

      setSession(currentSession);
      const userRole = await fetchUserProfile(currentSession.user.id);
      setRole(userRole);
    } catch (error) {
      console.error("Erro ao atualizar autenticação:", error);
      setSession(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    refreshAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      refreshAuth();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshAuth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  };

  return {
    session,
    role,
    loading,
    isAdmin: role === "admin",
    isDriver: role === "driver",
    isAuthenticated: !!session,
    refreshAuth,
    signOut
  };
}

/**
 * Hook para buscar dados de pedidos
 */
export function useOrders(filters?: { company_id?: string; module?: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("orders").select("*");

      if (filters?.company_id) {
        query = query.eq("company_id", filters.company_id);
      }

      if (filters?.module) {
        query = query.eq("module", filters.module);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters?.company_id, filters?.module]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders
  };
}
