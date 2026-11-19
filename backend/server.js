require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const STATUTS_AUTORISES = ["Ouvert", "En cours", "Résolu"];

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      titre VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      statut VARCHAR(20) NOT NULL DEFAULT 'Ouvert'
        CHECK (statut IN ('Ouvert', 'En cours', 'Résolu')),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/api/tickets", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tickets ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/tickets", async (req, res) => {
  const titre = (req.body.titre || "").trim();
  const description = (req.body.description || "").trim();

  if (!titre || !description) {
    return res.status(400).json({ error: "Titre et description obligatoires" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tickets (titre, description, statut) VALUES ($1, $2, 'Ouvert') RETURNING *",
      [titre, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur création ticket" });
  }
});

app.patch("/api/tickets/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { statut } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID invalide" });
  }
  if (!STATUTS_AUTORISES.includes(statut)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    const result = await pool.query(
      "UPDATE tickets SET statut = $1 WHERE id = $2 RETURNING *",
      [statut, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ticket introuvable" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour statut" });
  }
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API démarrée sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erreur init DB:", err);
    process.exit(1);
  });