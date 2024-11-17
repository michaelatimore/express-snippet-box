import type pg from "pg";
import assert from "assert";
import { error } from "console";
import { validateSnippetFields } from "./validator.js"; 

type SnippetModel = {
  id: number;
  title: string;
  content: string;
  expirationDate: number;
  userId: number;
};

export class Snippet {
  private pool: pg.Pool;

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
    }
  }

  async getSnippetById(snippetId: number) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM snippets WHERE snippet_id = $1",
        [snippetId]
      );
      if (result.rows.length === 0) {
        throw new Error("Snippet not found");
      }
      return result.rows[0];
    } catch (err) {
        console.error("Failed to retrieve snippet: ", error);
    }
  }

  async getAllSnippetsByUserId(userId: number) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM snippets WHERE user_id = $1",
        [userId]
      );
      return result.rows;
    } catch (err) {
        console.error("Failed to retrieve snippets: ", err);
      
    }
  }

  async updateSnippet(snippetId: number, title: string, content: string, expirationDate: number) {
    try {
      const result = await this.pool.query(
        "UPDATE snippets SET title = $1, content = $2, expiration_date = $3 WHERE snippet_id = $4 RETURNING *",
        [title, content, expirationDate, snippetId]
      );
      if (result.rows.length === 0) {
        throw new Error("Snippet not found");
      }
      return result.rows[0];
    } catch (err) {
      console.error("Failed to update snippet: ", err);
      throw err;
    }
  }

  async deleteSnippet(snippetId: number) {
    try {
      const result = await this.pool.query(
        "DELETE FROM snippets WHERE snippet_id = $1 RETURNING *",
        [snippetId]
      );
      if (result.rows.length === 0) {
        throw new Error("Snippet not found");
      }
      return { message: "Snippet successfully deleted" };
    } catch (err) {
      console.error("Failed to delete snippet: ", err);
      throw err;
    }
  }

}