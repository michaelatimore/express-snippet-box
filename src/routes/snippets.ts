import { Router } from "express";
import { pool } from "../db/db.js";

const snippetRouter = Router();

snippetRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM snippets");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/*snippetRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query("SELECT * FROM snippets WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

snippetRouter.post("/", async (req, res) => {
  try {
    const { title, content, expiration } = req.body;
    const result = await pool.query(
      "INSERT INTO snippets (title, content, expiration) VALUES ($1, $2, $3) RETURNING *",
      [title, content, expiration]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Invalid request. Please check your input" });
  }
});

snippetRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, expiration } = req.body;
    const result = await pool.query(
      "UPDATE snippets SET title = $1, content = $2, expiration = $3 WHERE id = $4 RETURNING *",
      [title, content, expiration, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

snippetRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query("DELETE FROM snippets WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.status(204).json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});*/
export { snippetRouter };
