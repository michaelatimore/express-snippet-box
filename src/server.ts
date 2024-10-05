import express from "express";
import { pool } from "./db/db.js";

const app = express();

const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.json({ serverMessage: "Hello world!" });
});

const query = await pool.query("select * from users", []);
console.log(query.rows[0]);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
