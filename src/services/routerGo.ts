/**
 * Serviços para integração com APIs externas
 */

import { Order, CreateOrderInput } from "../types";

/**
 * Serviço para integração com RouterGo API
 */
export class RouterGoService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ROUTERGO_API_KEY || "";
    this.baseUrl = import.meta.env.VITE_ROUTERGO_URL || "";
  }

  /**
   * Verifica se a integração está configurada
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.baseUrl);
  }

  /**
   * Envia pedido para RouterGo
   */
  async sendOrder(orderData: CreateOrderInput): Promise<Response> {
    if (!this.isConfigured()) {
      throw new Error("RouterGo API não configurada");
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey
      },
      body: JSON.stringify({
        recipient: orderData.recipient,
        street: orderData.street,
        number: orderData.number,
        complement: orderData.complement,
        neighborhood: orderData.neighborhood,
        city: orderData.city,
        state: orderData.state,
        zipCode: orderData.zipCode,
        rawText: orderData.rawText
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar para RouterGo: ${response.statusText}`);
    }

    return response;
  }
}

export const routerGoService = new RouterGoService();
