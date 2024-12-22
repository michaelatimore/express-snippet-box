import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";
import { scope } from "../models/tokenModel.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // verify the authenticity of incoming requests by checking for a valid authentication token in the Authorization header of the request.
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
    const result = await db.Models.Tokens.getUserForToken(
      token
      //scope.AUTHENTICATION
    );

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
  req: Request, //checks if a user is authenticated before allowing them to access a protected route.
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
