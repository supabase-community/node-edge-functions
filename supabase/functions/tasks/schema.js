import { pgTable, serial, smallint, text } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name"),
  status: smallint("status"),
});
