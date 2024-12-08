import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { Tokens } from "../models/tokenModel.js";
import { db } from "../db/db.js";

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Authorization header looks like this:
  //Authorization: 'Bearer ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  //split on the space, get the second element, which will be the token
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Verify the token is valid in the database
  try {
    const hash = createHash("sha256").update(token).digest("hex");
    const result = db.Models.Tokens.pool.query(
      "SELECT * FROM tokens WHERE hash = $1 AND expiry > NOW()",
      [hash]
    );
    if ((await result).rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Token is valid, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error verifying token: ", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
