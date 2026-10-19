/**
 * Validação de endereços
 */

import { Address } from "../types";

/**
 * Valida se um endereço tem os campos mínimos necessários
 */
export function validateAddress(addr: Address): boolean {
  return !!(addr.street && addr.city && addr.state);
}

/**
 * Formata um endereço para exibição
 */
export function formatAddress(addr: Address): string {
  const parts = [
    addr.street,
    addr.number,
    addr.complement,
    addr.neighborhood,
    addr.city,
    addr.state,
    addr.zipCode
  ].filter(Boolean);
  
  return parts.join(", ");
}

/**
 * Normaliza dados de endereço
 */
export function normalizeAddress(addr: Partial<Address>): Address {
  return {
    street: (addr.street || "").trim(),
    city: (addr.city || "").trim(),
    state: (addr.state || "").trim().toUpperCase(),
    number: (addr.number || "").trim(),
    complement: (addr.complement || "").trim(),
    neighborhood: (addr.neighborhood || "").trim(),
    zipCode: (addr.zipCode || "").trim()
  };
}
