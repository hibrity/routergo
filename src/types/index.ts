/**
 * Tipos compartilhados para o projeto RouterGo
 */

export interface Order {
  id?: number;
  company_id: string;
  module: string;
  recipient: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  raw_text: string;
  created_at?: Date;
}

export interface CreateOrderInput {
  company_id: string;
  module: string;
  recipient?: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode?: string;
  rawText?: string;
  sendToRouterGo?: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
}

export type UserRole = "admin" | "driver" | null;

export interface UserProfile {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
  license_plate?: string;
  is_available: boolean;
}

export interface RoutePoint {
  order_id: number;
  recipient: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "pending" | "in_progress" | "completed";
}

export interface CompanySettings {
  id: string;
  name: string;
  auto_dispatch_enabled: boolean;
  dispatch_radius_km: number;
  max_orders_per_driver: number;
}
