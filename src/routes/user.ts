import { Router } from "express";
import { pool } from "../db/db.js";

import type { Request, Response } from "express";


const userRouter = Router();

userRouter.post("/", createUser);

async function createUser (req: Request, res: Response) {
  /*validation of data that is required: email, password, first_name, last_name
    validation of a valid email address using string.match(regex)
  */
 const { email, first_name, last_name, password } = req.body;
 if (!email) {
   return res.status(400).json({ message: "email is missing" });
 }
 if (!first_name){
   return res.status(400).json({ message: "first_name is missing" });
  }
  if (!last_name){
    return res.status(400).json({ message: "last_name is missing" });
  }
  if (!password){
    return res.status(400).json({ message: "password is missing" });
  }
  // Email format validation using string.match() and a regex. The match() method of String values retrieves the result of matching this string against a regular expression.
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: "Invalid email format" });
  } 

  try {
    const newUser = await pool.query("INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *", [email, first_name, last_name, password]);
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
};

export { userRouter };

//const emailRx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
