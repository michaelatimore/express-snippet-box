import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Add a null user to the request
  req.user = null;

  // Check if Authorization header exists
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next();
  }

  // Attempt to split Authorization header into its parts
  const tokenParts = authorization.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return next();
  }

  // Get the second element in the array, which is the token
  const token = tokenParts[1];

  // Check that the token is a valid base64url encoded string
  if (typeof token !== "string" || token.length !== 43) {
    return next();
  }

  try {
    const result = await db.Models.Tokens.getUserForToken(token);

    if (!result) {
      return next();
    }

    // Add the user data to the request
    req.user = result;

    // Go to the next middleware
    next();
  } catch (err) {
    console.error("Error verifying token: ", err);
    next();
  }
}
export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
