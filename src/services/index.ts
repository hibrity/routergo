/**
 * Biblioteca de utilitários e serviços RouterGo
 */

// Tipos
export * from "../types";

// Utils
export { validateAddress, formatAddress, normalizeAddress } from "../utils/address";
export { sleep, generateId, formatDateBR, formatTimeBR, calculateDistance } from "../utils";

// Serviços
export { orderService, OrderService } from "./order";
export { routerGoService, RouterGoService } from "./routerGo";
export { companySettingsService, CompanySettingsService } from "./companySettings";
export { dispatchService, DispatchService } from "./dispatch";
export { routingService, RoutingService } from "./routing";

// Hooks
export { useAuth, useOrders } from "../../hooks/useAuth";
