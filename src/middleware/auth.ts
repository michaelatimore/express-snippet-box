import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db.js";
import { Tokens } from "../models/tokenModel.js";
import { User } from "../models/userModel.js";

/*
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  // add a null user to the request

  // check if Authorization header exists
    // if not, stop execution and go to the next middleware

  // attempt to split Authorization header into it's parts

  // check if resulting array has exactly two elements
    // if not, stop execution and go to the next middleware

  // get the second element in the array, which is the token
  
  // check that the token is exactly 43 characters long 
    // if not, stop execution and go to the next middleware
  
  // use the Tokens model to get the user data associated with the token

  // check that getting the user data was successful
    // if not, stop execution and go to the next middleware
    // else, add that user data to the request

  // go to the next middleware
}
 */

const tokenModel = new Tokens(db.Models.Tokens.pool);
const userModel = new User(db.Models.Users.pool);

async function authenticate(req: Request, res: Response, next: NextFunction) {
  // Add a null user to the request
  req.user = null;

  // Check if Authorization header exists
  const authorization = req.headers.authorization;
  if (!authorization) {
    return next();
  }

  // Attempt to split Authorization header into its parts
  const tokenParts = authorization.split(" ");
  if (tokenParts.length !== 2) {
    return next();
  }

  // Get the second element in the array, which is the token
  const token = tokenParts[1];

  // Check that the token is a valid base64url encoded string
  if (!token || typeof token !== "string" || token.length !== 43) {
    return next();
  }

  try {
    // Compute the hash of the token
    const hash = createHash("sha256").update(token).digest("hex");

    // Use the Tokens model to get the user data associated with the token
    const result = await tokenModel.pool.query(
      "SELECT * FROM tokens WHERE hash = $1 AND expiry > NOW()",
      [hash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the user ID from the token
    const userId = result.rows[0].user_id;

    // Fetch the user data using the UserModel
    const user = await userModel.getUserById(userId);

    // Add the user data to the request
    req.user = user;

    // Go to the next middleware
    next();
  } catch (err) {
    console.error("Error verifying token: ", err);
    next();
  }
}
