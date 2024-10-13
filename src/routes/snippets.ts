import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";

const snippetRouter = Router();

snippetRouter.get("/:userId", retrieveUserSnippetById); //dynamic route definition

async function retrieveUserSnippetById(req: Request, res: Response) {
  //get all snippets from user by their user_id
  const { user_id } = req.params;
  if (!user_id) {
    //incoming data validation
    return res.status(400).json({ message: "user_id is missing" });
  }
  if (isNaN(parseInt(user_id))) {
    //incoming data validation
    return res.status(400).json({ message: "user_id must be a number" });
  }
  try {
    const snippet = await pool.query(
      //prepare the SQL query for updating the snippet
      "SELECT * FROM snippets WHERE user_id = $1",
      [user_id]
    );
    res.json(snippet.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve snippets" });
  }
}

snippetRouter.get("/:userId/:snippetId", getAllSnippetsForUser); //dynamic route definition

async function getAllSnippetsForUser(req: Request, res: Response) {
  const { user_id, snippet_id } = req.params;
  if (!user_id || isNaN(parseInt(user_id))) {
    //incoming data validation
    return res.status(400).json({ message: "invalid user_id" });
  }
  if (!snippet_id || isNaN(parseInt(snippet_id))) {
    //incoming data validation
    return res.status(400).json({ message: "invalid snippet_id" });
  }
  try {
    const snippets = await pool.query(
      //prepare the SQL query for updating the snippet
      //parameterized queries are used to prevent SQL injection attacks.
      "SELECT * FROM snippets WHERE user_id = $1 AND snippet_id = $2",
      [user_id, snippet_id]
    );
  if (snippets.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "snippet not found for the specified user" });
  }
  res.json(snippets.rows[0]); //sends the data of the found snippet back to the client as a JSON object.
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to retrieve snippet" });
  }
}

snippetRouter.post("/", createSnippet);
async function createSnippet(req: Request, res: Response) {
  const { title, content, expiration_date, user_id } = req.body;
  if (!title) {
    //incoming data validation
    return res.status(400).json({ message: "title is missing" });
  }
  if (!user_id) {
    //incoming data validation
    return res.status(400).json({ message: "user_id is missing" });
  }
  if (!content) {
    //incoming data validation
    return res.status(400).json({ message: "content is missing" });
  }
  if (!expiration_date) {
    //incoming data validation
    return res.status(400).json({ message: "expiration_date is missing" });
  }
  if (isNaN(parseInt(user_id))) {
    //incoming data validation
    return res.status(400).json({ message: "user_id must be a number" });
  }
  try {
    const newSnippet = await pool.query(
      //prepare the SQL query for updating the snippet
      "INSERT INTO snippets (title, content, expiration_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, expiration_date, user_id]
    );
    res.status(201).json(newSnippet.rows[0]); //a request has succeeded and a new resource has been created and returned to the client as a JSON object.
  } catch (err) {
    console.error(err);
  if (err instanceof Error) {
    if ("code" in err && err.code === "23503") {
      // Foreign key violation
      res.status(400).json({ message: "invalid user_id provided" }); //Bad request
    } else {
      res.status(500).json({ message: "failed to create snippet" });
    }
  }
 }
}


snippetRouter.put("/:snippet_id", updateSnippet); //dynamic route definition

async function updateSnippet(req: Request, res: Response) {
  const { snippet_id } = req.params; //destructured parameters
  if (!snippet_id) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id is missing" });
  }
  if (isNaN(parseInt(snippet_id))) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id must be a number" });
  }

  const { title, content, expiration_date } = req.body;
  if (expiration_date && isNaN(parseInt(expiration_date))) {
    //incoming data validation
    return res
      .status(400)
      .json({ message: "expiration_date must be a number" });
  }
  try {
    const snippet = //prepare the SQL query for updating the snippet
    (await pool.query("select * from snippets where id = $1", [snippet_id]))
      .rows[0];
    const sql = `
    UPDATE snippets
    SET title = $1, content = $2, expiration_date = $3
    WHERE snippet_id = $4
    `;
    const args = [
      // Prepare the arguments for the update query, using existing values if not provided
      title ?? snippet.title,
      content ?? snippet.content,
      expiration_date ?? snippet.expiration_date,
      snippet_id,
    ];
    const result = await pool.query(sql, args);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Snippet not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update snippet" });
  }
}

snippetRouter.delete("/:snippet_id", deleteSnippet); //dynamic route definition

async function deleteSnippet(req: Request, res: Response) {
  const { snippet_id } = req.params; //destructured parameter
  if (!snippet_id) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id is missing" });
  }
  if (isNaN(parseInt(snippet_id))) {
    //incoming data validation
    return res.status(400).json({ message: "snippet_id must be a number" });
  }
  try {
    const deletedSnippet = await pool.query(
      "DELETE FROM snippets WHERE snippet_id = $1 RETURNING *",
      [snippet_id]
    );
    if (deletedSnippet.rows.length === 0) {
      res.status(404).json({ message: "Snippet not found" });
    } else {
      res.json({ message: "Snippet successfully deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete snippet" });
  }
}
export { snippetRouter };
