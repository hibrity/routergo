/**
 * Serviços para configurações da empresa
 */

import { supabase } from "../lib/supabase";
import type { CompanySettings } from "../types";

export type DemandMode = "alta" | "media" | "baixa" | "manual";

export interface ExtendedCompanySettings extends CompanySettings {
  demand_mode: DemandMode;
  delivery_radius_km: number;
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export class CompanySettingsService {
  /**
   * Obtém configurações da empresa
   */
  async getSettings(): Promise<ExtendedCompanySettings> {
    const userId = await getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    const { data, error } = await supabase
      .from("company_settings")
      .select("demand_mode, delivery_radius_km")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      // Se não existir, cria padrão
      const defaults = {
        user_id: userId,
        demand_mode: "media" as DemandMode,
        delivery_radius_km: 1.2
      };

      await supabase.from("company_settings").insert(defaults);

      return {
        demand_mode: "media",
        delivery_radius_km: 1.2
      };
    }

    return data as ExtendedCompanySettings;
  }

  /**
   * Atualiza configurações da empresa
   */
  async updateSettings(settings: ExtendedCompanySettings): Promise<void> {
    const userId = await getUserId();
    if (!userId) throw new Error("Usuário não autenticado.");

    const { error } = await supabase
      .from("company_settings")
      .update({
        demand_mode: settings.demand_mode,
        delivery_radius_km: settings.delivery_radius_km,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId);

    if (error) throw error;
  }

  /**
   * Define o modo de demanda
   */
  async setDemandMode(mode: DemandMode): Promise<void> {
    const current = await this.getSettings();
    await this.updateSettings({
      ...current,
      demand_mode: mode
    });
  }

  /**
   * Define o raio de entrega em km
   */
  async setDeliveryRadius(radiusKm: number): Promise<void> {
    const current = await this.getSettings();
    await this.updateSettings({
      ...current,
      delivery_radius_km: radiusKm
    });
  }
}

export const companySettingsService = new CompanySettingsService();
