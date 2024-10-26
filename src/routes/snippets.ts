import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";

const snippetRouter = Router();

snippetRouter.get("/all/:userId", getAllSnippetsByUserId);//dynamic route definition

async function getAllSnippetsByUserId(req: Request, res: Response) {
  //get all snippets from user by their user_id
  const { userId } = req.params;
  if (!userId) {
    //incoming data validation
    return res.status(400).json({ message: "user id is missing" });//Bad Request
  }
  if (isNaN(parseInt(userId))) {
    //incoming data validation
    return res.status(400).json({ message: "user id must be a number" });
  }
  try {
    const snippet = await pool.query(
      //prepare the SQL query for updating the snippet
      "select * from snippets where user_id = $1",
      [userId]
    );
    res.json(snippet.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to retrieve snippets" });//Internal Server Error
  }
}

snippetRouter.get("/:snippetId", getSnippet); //dynamic route definition

async function getSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;
  if (!snippetId || isNaN(parseInt(snippetId))) {
    //incoming data validation
    return res.status(400).json({ message: "invalid snippet id" });
  }
  try {
    const snippets = await pool.query(
      //prepare the SQL query for updating the snippet
      //parameterized queries are used to prevent SQL injection attacks.
      "select * from snippets where snippet_id = $1",
      [snippetId]
    );
    if (snippets.rows.length === 0) {
      return res.status(404).json({ message: "no snippet with that id found" });//"Not Found
    }
    res.json(snippets.rows[0]); //sends the data of the found snippet back to the client as a JSON object.
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to retrieve snippet" });
  }
}

snippetRouter.post("/", createSnippet);
async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate, userId } = req.body;
  if (!title) {
    //incoming data validation
    return res.status(400).json({ message: "title is missing" });
  }
  if (!userId) {
    //incoming data validation
    return res.status(400).json({ message: "user_id is missing" });
  }
  if (!content) {
    //incoming data validation
    return res.status(400).json({ message: "content is missing" });
  }
  if (!expirationDate) {
    //incoming data validation
    return res.status(400).json({ message: "expiration_date is missing" });
  }
  if (isNaN(parseInt(expirationDate)) || parseInt(expirationDate) <= 0) {//Values in req.params are always strings so they have to be parsed to integers.
    return res
      .status(400)
      .json({ message: "expiration date must be a positive number" });
  }
  if (isNaN(parseInt(userId))) {
    //incoming data validation
    return res.status(400).json({ message: "user id must be a number" });
  }
  try {
    const newSnippet = await pool.query(
      //prepare the SQL query for updating the snippet
      "INSERT INTO snippets (title, content, expiration_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, expirationDate, userId]
    );
    res.status(201).json(newSnippet.rows[0]); //a request has succeeded and a new resource has been created and returned to the client as a JSON object.
  } catch (err: any) {
    /*
   *Typescript Error Object* type guard: if (err instanceof Error && 'code' in err && err.code === "23503"). By default, Typescript treats the error as unknown. 
   With err as unknown, you can't directly access properties or methods on it without first narrowing its type. Narrow it's type. Using 'any' overrides the type checking.
   You can then access the code property of the PostgreSQL error object.
   */ 
   console.error(err);
    if (err.code === "23503") {
      // Foreign key violation
      res.status(400).json({ message: "invalid user id provided" });
    } else {
      res.status(500).json({ message: "failed to create snippet" });
    }
  }
}

snippetRouter.put("/:snippetId", updateSnippet); //dynamic route definition

async function updateSnippet(req: Request, res: Response) {
  const { snippetId } = req.params; //destructured parameters. used to identify which snippet to update
  if (!snippetId) {
    //incoming data validation
    return res.status(400).json({ message: "snippet id is missing" });
  }
  if (isNaN(parseInt(snippetId))) {
    //incoming data validation
    return res.status(400).json({ message: "snippet id must be a number" });
  }

  const { title, content, expirationDate } = req.body; //contains the new information to update the snippet with.

  try {
    const snippet = //prepare the SQL query for updating the snippet
      (await pool.query("SELECT * FROM SNIPPETS WHERE id = $1", [snippetId]))
        .rows[0];
    const sql = `
    UPDATE snippets
    SET title = $1, content = $2, expiration_date = $3
    WHERE snippet_id = $4
    `;
    const args = [
      //prepare the arguments for the update query, using existing values if not provided. this allows for only the fields provided in the request body
      title ?? snippet.title,
      content ?? snippet.content,
      expirationDate ?? snippet.expiration_date,
      snippetId,
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

snippetRouter.delete("/:snippetId", deleteSnippet);//dynamic route definition

async function deleteSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;
  if (!snippetId) {
    //incoming data validation
    return res.status(400).json({ message: "snippet id is missing" });
  }
  if (isNaN(parseInt(snippetId))) {
    //incoming data validation
    return res.status(400).json({ message: "snippet id must be a number" });
  }
  try {
    const deletedSnippet = await pool.query(
      "delete from snippets where id = $1",
      [snippetId]
    );
    if (deletedSnippet.rows.length === 0) {
      res.status(404).json({ message: "snippet not found" });
    } else {
      res.json({ message: "snippet successfully deleted" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete snippet" });
  }
}
export { snippetRouter };
