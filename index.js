import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import express from "express";
import { tasks } from "./schema.js";

const { Pool } = pg;
const connectionString = process.env.POOLER_URL;
const pool = new Pool({ connectionString });
const db = drizzle(pool);

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const allTasks = await db.select().from(tasks);

  res.json(allTasks);
});

app.post("/", async (req, res) => {
  const { name, status } = req.body;
  const result = await db.insert(tasks).values({ name, status }).returning();

  res.json(result);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const task = await db.select().from(tasks).where(eq(tasks.id, id));

  res.json(task);
});

app.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, status } = req.body;
  const result = await db.update(tasks)
    .set({ name, status })
    .where(eq(tasks.id, id))
    .returning();

  res.json(result);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  res.json("ok");
});

app.listen(8000);
