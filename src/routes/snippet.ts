import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { ensureAuthenticated } from "./auth.js";
import {validateSnippetId, validateSnippetFields,
} from "../models/validator.js";

const snippetRouter = Router();

snippetRouter.post("/", ensureAuthenticated, createSnippet);
snippetRouter.get("/all/:userId", ensureAuthenticated, getAllSnippetsByUserId);
snippetRouter.get("/:snippetId", ensureAuthenticated, getSnippetById);
snippetRouter.put("/:snippetId", ensureAuthenticated, updateSnippet);
snippetRouter.delete("/:snippetId", ensureAuthenticated, deleteSnippet);

async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate, userId } = req.body;
  try {
    const newSnippet = await db.Models.Snippet.createSnippet(
      title,
      content,
      expirationDate,
      userId
    );
    res.status(201).json(newSnippet);
  } catch (err) {
    console.error("Failed to create snippet: ", err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to create snippet" });
    }
  }
}

async function getAllSnippetsByUserId(req: Request, res: Response) {
  const { userId } = req.params;
  
  try {
    const snippets = await db.Models.Snippet.getAllSnippetsByUserId(parseInt(userId ?? ""));
    res.json(snippets);
  } catch (err) {
    console.error("Failed to retrieve snippets: ", err);
    if (err instanceof Error && err.message === "Snippets not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve snippets" });
    };
  }
}

async function getSnippetById(req: Request, res: Response) {
  const { snippetId } = req.params;

  try {
    const snippet = await db.Models.Snippet.getSnippetById(snippetId!);
    res.json(snippet);
  } catch (err) {
    console.error("Failed to retrieve snippet: ", err);
    if (err instanceof Error && err.message === "Snippet not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve snippet" });
    }
  }
}

async function updateSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;
  const { title, content, expirationDate, userId } = req.body;

  try {
    const updatedSnippet = await db.Models.Snippet.updateSnippet(
      snippetId!,
      title,
      content,
      expirationDate,
      userId
    );
    res.json(updatedSnippet);
  } catch (err) {
    console.error("Failed to update snippet: ", err);
    if (err instanceof Error && err.message === "Snippet not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to update snippet" });
    }
  }
}

async function deleteSnippet(req: Request, res: Response) {
  const { snippetId } = req.params;
 
  try {
    const result = await db.Models.Snippet.deleteSnippet(snippetId!);
    res.json(result);
  } catch (err) {
    console.error("Failed to delete snippet: ", err);
    if (err instanceof Error && err.message === "Snippet not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete snippet" });
    }
  }
}

export { snippetRouter };

/*
Typescript Error Object type guard: if (err instanceof Error && 'code' in err && err.code === "23503"). By default, Typescript treats the error as unknown.
    With err as unknown, you can't directly access properties or methods on it without first narrowing its type. Narrow it's type. Using 'any' overrides the type checking.
    You can then access the code property of the PostgreSQL error object.
  */
