/**
 * Serviços para gestão de pedidos
 */

import { supabase } from "../lib/supabase";
import type { Order, CreateOrderInput } from "../types";
import { validateAddress } from "../utils/address";
import { routerGoService } from "./routerGo";

export class OrderService {
  /**
   * Cria um novo pedido
   */
  async createOrder(input: CreateOrderInput): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      // Valida endereço mínimo
      if (!validateAddress({ street: input.street, city: input.city, state: input.state })) {
        return { success: false, error: "Endereço insuficiente" };
      }

      // Salva pedido no Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            company_id: input.company_id,
            module: input.module,
            recipient: input.recipient || "",
            street: input.street,
            number: input.number || "",
            complement: input.complement || "",
            neighborhood: input.neighborhood || "",
            city: input.city,
            state: input.state,
            zip_code: input.zipCode || "",
            raw_text: input.rawText || "",
            created_at: new Date()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Integração opcional com RouterGo
      if (input.sendToRouterGo && routerGoService.isConfigured()) {
        try {
          await routerGoService.sendOrder(input);
        } catch (err) {
          console.error("Erro ao enviar para RouterGo:", err);
          // Não falha a criação do pedido se RouterGo falhar
        }
      }

      return { success: true, order: data as Order };
    } catch (err: any) {
      console.error("Erro ao criar pedido:", err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Lista pedidos com filtros opcionais
   */
  async listOrders(filters?: { company_id?: string; module?: string }): Promise<Order[]> {
    try {
      let query = supabase.from("orders").select("*");

      if (filters?.company_id) {
        query = query.eq("company_id", filters.company_id);
      }

      if (filters?.module) {
        query = query.eq("module", filters.module);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Order[];
    } catch (err: any) {
      console.error("Erro ao listar pedidos:", err);
      return [];
    }
  }

  /**
   * Busca um pedido por ID
   */
  async getOrderById(id: number): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Order;
    } catch (err: any) {
      console.error("Erro ao buscar pedido:", err);
      return null;
    }
  }

  /**
   * Atualiza status de um pedido
   */
  async updateOrderStatus(id: number, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      return true;
    } catch (err: any) {
      console.error("Erro ao atualizar pedido:", err);
      return false;
    }
  }
}

export const orderService = new OrderService();
