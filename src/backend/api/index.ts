/**
 * Backend API RouterGo
 * Servidor Express para gestão de pedidos
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { validateAddress } from "../../utils/address";
import { routerGoService } from "../../services/routerGo";
import type { CreateOrderInput } from "../../types";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Endpoint raiz
app.get("/", (_req, res) => {
  res.send("Anote Backend rodando");
});

// Criar pedido
app.post("/orders", async (req, res) => {
  try {
    const input: CreateOrderInput = req.body;

    // Valida endereço mínimo
    if (!validateAddress({ street: input.street, city: input.city, state: input.state })) {
      return res.status(400).json({ error: "Endereço insuficiente" });
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

    res.json({ success: true, order: data });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Listar pedidos
app.get("/orders", async (req, res) => {
  try {
    const { company_id, module } = req.query;
    let query = supabase.from("orders").select("*");

    if (company_id) {
      query = query.eq("company_id", company_id as string);
    }

    if (module) {
      query = query.eq("module", module as string);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ orders: data });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rodar backend
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Anote Backend rodando na porta ${PORT}`)
);

export default app;
