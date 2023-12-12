import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import { notes } from "./schema.js";
import process from "node:process";

const { Pool } = pg;
const connectionString = process.env.POOLER_URL;
const pool = new Pool({ connectionString });
const db = drizzle(pool);

const app = express();
app.use(express.json());

app.get("/notes", async (req, res) => {
  const allNotes = await db.select().from(notes);
  res.json(allNotes);
});

app.post("/notes", async (req, res) => {
  const { title } = req.body;
  const result = await db.insert(notes).values({ title }).returning();
  res.json(result);
});

app.listen(8000);
