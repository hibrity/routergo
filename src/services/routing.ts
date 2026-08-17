/**
 * Serviços para geração e otimização de rotas
 */

import { calculateDistance } from "../utils";

export interface Stop {
  delivery_id?: string;
  lat: number;
  lng: number;
  label?: string;
}

export interface Route {
  stops: Stop[];
  totalKm: number;
}

export interface RouteOptions {
  maxStops: number;
  radiusKm: number;
}

class RoutingService {
  /**
   * Calcula distância entre dois pontos usando fórmula de Haversine
   */
  private haversineKm(a: Stop, b: Stop): number {
    return calculateDistance(a.lat, a.lng, b.lat, b.lng);
  }

  /**
   * Ordena paradas por vizinho mais próximo (algoritmo Nearest Neighbor)
   */
  private orderNearestNeighbor(stops: Stop[]): Stop[] {
    if (stops.length <= 2) return stops;

    const remaining = [...stops];
    const ordered: Stop[] = [remaining.shift()!];

    while (remaining.length) {
      const last = ordered[ordered.length - 1];
      let bestIdx = 0;
      let bestDist = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = this.haversineKm(last, remaining[i]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      ordered.push(remaining.splice(bestIdx, 1)[0]);
    }
    return ordered;
  }

  /**
   * Gera rotas agrupando paradas por proximidade geográfica
   * 
   * @param stops Lista de paradas para roteirizar
   * @param opts Opções de configuração (maxStops, radiusKm)
   * @returns Array de rotas otimizadas
   */
  generateRoutes(stops: Stop[], opts: RouteOptions): Route[] {
    const maxStops = Math.max(2, Math.floor(opts.maxStops || 5));
    const radiusKm = Math.max(0.2, Number(opts.radiusKm || 1.2));

    const left = [...stops];
    const routes: Route[] = [];

    while (left.length) {
      // Seed inicial
      const seed = left.shift()!;
      const cluster: Stop[] = [seed];

      // Junta paradas próximas do seed dentro do raio
      for (let i = left.length - 1; i >= 0; i--) {
        if (cluster.length >= maxStops) break;
        const d = this.haversineKm(seed, left[i]);
        if (d <= radiusKm) {
          cluster.push(left.splice(i, 1)[0]);
        }
      }

      // Ordena paradas da rota por vizinho mais próximo
      const ordered = this.orderNearestNeighbor(cluster);

      // Calcula distância total da rota
      let total = 0;
      for (let i = 0; i < ordered.length - 1; i++) {
        total += this.haversineKm(ordered[i], ordered[i + 1]);
      }

      routes.push({ stops: ordered, totalKm: total });
    }

    return routes;
  }

  /**
   * Otimiza uma única rota reordenando as paradas
   */
  optimizeRoute(stops: Stop[]): Route {
    const ordered = this.orderNearestNeighbor(stops);
    
    let total = 0;
    for (let i = 0; i < ordered.length - 1; i++) {
      total += this.haversineKm(ordered[i], ordered[i + 1]);
    }

    return { stops: ordered, totalKm: total };
  }
}

export const routingService = new RoutingService();
