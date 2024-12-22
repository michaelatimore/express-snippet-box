import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { ensureAuthenticated } from "../middleware/auth.js"; //verify the authenticity of incoming requests by checking for a valid authentication token in the Authorization header of the request.

import { validateSnippetId } from "../models/validator.js";

const snippetRouter = Router();

snippetRouter.post("/", ensureAuthenticated, createSnippet);
snippetRouter.get("/all/:userId", getAllSnippetsByUserId);
snippetRouter.get("/:snippetId", getSnippetById);
snippetRouter.put("/:snippetId", ensureAuthenticated, updateSnippet);
snippetRouter.delete("/:snippetId", ensureAuthenticated, deleteSnippet);

async function createSnippet(req: Request, res: Response) {
  const { title, content, expirationDate } = req.body;
  const userId = req.user!.id;
  try {
    const newSnippet = await db.Models.Snippet.createSnippet(
      title,
      content,
      expirationDate,
      userId
    );
    res.status(201).json(newSnippet); //successful request resulting in the creation of a new resource
  } catch (err) {
    console.error("Failed to create snippet: ", err);
    return null;
    ``;
    /*if (err instanceof Error) {
      res.status(400).json({ message: err.message });// "Bad Request." It signifies that the server cannot process the request due to a client error
    } else {
      res.status(500).json({ message: "Failed to create snippet" });
    }*/
  }
}

async function getAllSnippetsByUserId(req: Request, res: Response) {
  const userId = req.user!.id; //Non-Null Assertion Operator
  //authenticate gives me access to the properties on the user without having to use object deconstruction

  try {
    const snippets = await db.Models.Snippet.getAllSnippetsByUserId(userId);
    res.status(200).json(snippets); //successful request, return data
  } catch (err) {
    console.error("Failed to retrieve snippets: ", err);
    return null;

    /*if (err instanceof Error && err.message === "Snippet not found") {
      // instance of Error needed to access the error message
      res.status(404).json({ message: err.message }); //resource not found. err message will come from the snippetModel function.
    } else {
      res.status(500).json({ message: "Failed to retrieve snippets" }); //generic server-side error
    }*/
  }
}

async function getSnippetById(req: Request, res: Response) {
  const snippetId = req.params.snippetId;

  try {
    const snippet = await db.Models.Snippet.getSnippetById(snippetId!);
    res.status(200).json(snippet);
  } catch (err) {
    console.error("Failed to retrieve snippet: ", err);
    return null;

    /*if (err instanceof Error && err.message === "Snippet not found") {
      //err message will come from the snippetModel function.
      res.status(404).json({ message: err.message }); //resource not found.
    } else {
      res.status(500).json({ message: "Failed to retrieve snippet" }); //generic server-side error
    }*/
  }
}

type updateSnippetParams = {
  title: string;
  content: string;
  expirationDate: number;
  userId: number;
};

async function updateSnippet(req: Request, res: Response) {
  const snippetId = req.params.snippetId;
  const { title, content, expirationDate, userId } =
    req.body as updateSnippetParams;

  try {
    const updatedSnippet = await db.Models.Snippet.updateSnippet(
      snippetId!,
      title,
      content,
      expirationDate,
      userId
    );
    res.status(200).json(updatedSnippet);
  } catch (err) {
    console.error("Failed to update snippet: ", err);
    return null;

    /*if (err instanceof Error && err.message === "Snippet not found") {
      //err message will come from the snippetModel function.

      res.status(404).json({ message: err.message }); //resource not found.
    } else {
      res.status(500).json({ message: "Failed to update snippet" });
    }*/
  }
}

async function deleteSnippet(req: Request, res: Response) {
  const snippetId = req.params.snippetId;
  const userId = req.user!.id;

  try {
    validateSnippetId(snippetId!);
    const result = await db.Models.Snippet.deleteSnippet(snippetId!, userId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to delete snippet: ", err);
    return null;

    /*if (err instanceof Error && err.message === "Failed to delete snippet: ") {
      //err.message will come from the snippetModel function.

      res.status(404).json({ message: err.message }); //resource not found.
    } else {
      res.status(500).json({ message: "Failed to delete snippet" });
    }*/
  }
}

export { snippetRouter };
