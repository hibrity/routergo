/**
 * Serviços para gestão de motoristas e rotas
 */

import { supabase } from "../lib/supabase";
import type { Driver, RoutePoint } from "../types";

interface DriverProfile {
  id: string;
  name: string;
  driver_status: string;
  queue_position: number;
}

interface Route {
  id: string;
  user_id: string;
  name: string;
  status: string;
  assigned_driver_id: string | null;
}

export class DispatchService {
  /**
   * Obtém motoristas disponíveis
   */
  async getAvailableDrivers(): Promise<DriverProfile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,name,driver_status,queue_position")
      .eq("driver_status", "available")
      .order("queue_position", { ascending: true })
      .limit(7);

    if (error) throw error;

    return data || [];
  }

  /**
   * Obtém rotas novas não atribuídas
   */
  async getNewRoutes(): Promise<Route[]> {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("status", "new")
      .is("assigned_driver_id", null)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  }

  /**
   * Atribui uma rota a um motorista
   */
  async assignRoute(routeId: string, driverId: string): Promise<void> {
    const { error } = await supabase
      .from("routes")
      .update({
        assigned_driver_id: driverId
      })
      .eq("id", routeId);

    if (error) throw error;
  }

  /**
   * Move motorista para o final da fila
   */
  async moveDriverToEnd(driverId: string): Promise<void> {
    const { data } = await supabase
      .from("profiles")
      .select("queue_position")
      .order("queue_position", { ascending: false })
      .limit(1);

    const lastPosition = data?.[0]?.queue_position || 0;

    await supabase
      .from("profiles")
      .update({
        queue_position: lastPosition + 1
      })
      .eq("id", driverId);
  }

  /**
   * Executa o engine de dispatch automático
   */
  async runDispatchEngine(): Promise<void> {
    try {
      const drivers = await this.getAvailableDrivers();
      const routes = await this.getNewRoutes();

      if (!drivers.length) return;
      if (!routes.length) return;

      for (let i = 0; i < routes.length; i++) {
        const driver = drivers[i % drivers.length];
        const route = routes[i];

        await this.assignRoute(route.id, driver.id);
        await this.moveDriverToEnd(driver.id);
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    }
  }

  /**
   * Atualiza status do motorista
   */
  async updateDriverStatus(driverId: string, status: "available" | "busy" | "offline"): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ driver_status: status })
      .eq("id", driverId);

    if (error) throw error;
  }

  /**
   * Obtém todas as rotas de um motorista
   */
  async getDriverRoutes(driverId: string): Promise<Route[]> {
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("assigned_driver_id", driverId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  }
}

export const dispatchService = new DispatchService();
