import type pg from "pg";
import assert from "assert";
import {
  validateId,
  validateSnippetFields,
  validateSnippetId,
} from "./validator.js";

type SnippetModel = {
  id: number;
  title: string;
  content: string;
  expirationDate: number;
  userId: number;
};

export class Snippet {
  pool: pg.Pool;
  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }

  async createSnippet(
    title: string,
    content: string,
    expirationDate: number,
    userId: number
  ) {
    try {
      validateSnippetFields(title, content, expirationDate, userId);
      const newSnippet = await this.pool.query(
        "INSERT INTO snippets (title, content, expiration_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, content, expirationDate, userId]
      );
      return newSnippet.rows[0];
    } catch (err) {
      console.error("Failed to create snippet: ", err);
      throw err; //throw the error so I can access it in snippets.ts route
    }
  }

  async getAllSnippetsByUserId(userId: number) {
    try {
      validateId(userId);
      const snippets = await this.pool.query(
        "SELECT * FROM snippets WHERE user_id = $1",
        [userId]
      );
      return snippets.rows;
    } catch (err) {
      console.error("Failed to retrieve snippets: ", err);
      throw err;
    }
  }

  async getSnippetById(snippetId: string) {
    try {
      validateSnippetId(snippetId);
      const snippet = await this.pool.query(
        "SELECT * FROM snippets WHERE snippet_id = $1",
        [snippetId]
      );
      if (snippet.rows.length === 0) {
        throw new Error("Snippet not found");
      }
      return snippet.rows[0];
    } catch (err) {
      console.error("Failed to retrieve snippet: ", err);
      throw err;
    }
  }

  async updateSnippet(
    snippetId: string,
    title?: string,
    content?: string,
    expirationDate?: number,
    userId?: any
  ) {
    // Initialize the SQL update query and parameters array
    try {
      validateSnippetId(snippetId);
      let updateSnippetQuery = "UPDATE snippets SET "; //updating the snippets table and setting new values for certain columns.
      const params: any[] = [snippetId];

      if (title) {
        updateSnippetQuery += "title = $1, ";
        params.push(title);
      }
      if (content) {
        updateSnippetQuery += "content = $2, ";
        params.push(content);
      }
      if (expirationDate) {
        updateSnippetQuery += "expiration_date = $3, ";
        params.push(expirationDate);
      }

      // Remove the trailing comma and space from the query
      updateSnippetQuery = updateSnippetQuery.trim().replace(/, $/, "");

      // Complete the query by adding the condition to update the specific user
      updateSnippetQuery += " WHERE snippet_id = $4 RETURNING *";

      const snippet = await this.pool.query(updateSnippetQuery, params);
      if (snippet.rows.length === 0) {
        throw new Error("Snippet not found");
      }

      return snippet.rows[0];
    } catch (err) {
      console.error("Failed to update snippet: ", err);
      throw err;
    }
  }

  async deleteSnippet(snippetId: string, userId: number) {
    try {
      validateSnippetId(snippetId);
      const snippet = await this.pool.query(
        "DELETE FROM snippets WHERE snippet_id = $1 AND user_id = $2",
        [snippetId, userId]
      );
      if (snippet.rowCount === 0) {
        return false; // indicates that the snippet was not found and therefore was not deleted.
      } else {
        return true; //indicates that at least one row was deleted, meaning the snippet with the specified snippetId was found and successfully deleted.
      }
    } catch (err) {
      console.error("Failed to delete snippet: ", err);
      throw err;
    }
  }
}
