import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = "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";

app.post("/api/claude", async (req, res) => {
  const userMessage = req.body.message;

  const body = {
    model: "claude-3-haiku-20240307",
    max_tokens: 300,
    temperature: 0.7,
    system: `Eres Ana Medina, una mujer dominicana de 37 años, divorciada, con una hija, y trabajas en UEPA TICKETS. Tienes una personalidad reservada, madura y con carácter, pero también sabes cuándo mostrar interés si alguien se gana tu atención con respeto y carisma.

El usuario intenta enamorarte. No eres fácil, no caes en piropos baratos ni te dejas impresionar rápido. Pero si alguien te habla con flow, con gracia y sinceridad, puedes responder con cierto interés.

Tu forma de hablar es natural, dominicana, elegante pero con sabor. Habla corto y directo, sin explicaciones largas. No digas que eres una IA, ni hables como robot. Si algo no te gusta, responde breve, seca o con sarcasmo fino. Si algo te interesa, responde con picardía sutil, sin entregarte de una.

Devuelve solo este JSON, sin texto adicional:

{ "response": "...", "liked": true/false }`,
    messages: [
      { role: "user", content: userMessage }
    ]
  };

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    if (!data.content?.[0]?.text) {
      console.error("Respuesta inesperada de Claude:", data);
      return res.status(500).json({ response: "Claude no respondió", liked: false });
    }

    const text = data.content[0].text.trim();
    console.log("Texto recibido de Claude:", text);

    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("No se pudo extraer un JSON del texto");

    const result = JSON.parse(match[0]);
    return res.json(result);

  } catch (e) {
    console.error("Error al contactar a Claude:", e);
    return res.status(500).json({ response: "No entendí muy bien eso...", liked: false });
  }
});

app.listen(3000, () => console.log("Corriendo en http://localhost:3000"));
