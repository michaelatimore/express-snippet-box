import type pg from 'pg';
import bcrypt from "bcrypt";


type UserModel = {
  email: string, 
  firstName: string, 
  lastName: string, 
  password: string
};

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }  

  async createUser(email: string, firstName: string, lastName: string, password: string) {
    try {
      if (!email) {
        throw new Error("Email is missing");
      }
      const emailRx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
      if (!email.match(emailRx)) {
        throw new Error("Invalid email format");
      }
      if (!firstName) {
        throw new Error("First name is missing");
      }
      if (!lastName) {
        throw new Error("Last name is missing");
      }
      if (!password) {
        throw new Error("Password is missing");
      }     

      if (password.length < 8) {
        throw new Error("Minimum password length is 8 characters");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      const newUser = await this.pool.query(
        "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [email, firstName, lastName, passwordHash, false]
      );
      return newUser.rows[0];
    } catch (err) {
      console.error("Failed to create user: ", err);
    }
  }
}





/*
import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";
import { Users } from "./users.js";  // Import the Users class

const userRouter = Router();
const usersModel = new Users(pool);

userRouter.post("/", createUser);
userRouter.post("/login", userLogin);

async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    const newUser = await usersModel.createUser(email, firstName, lastName, password);
    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof Error) {
      // Map specific error messages to appropriate HTTP status codes
      const errorMessages = [
        "Email is missing",
        "Invalid email format",
        "First name is missing",
        "Last name is missing",
        "Password is missing",
        "Minimum password length is 8 characters"
      ];
      
      if (errorMessages.includes(err.message)) {
        return res.status(400).json({ message: err.message });
      }
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
}

async function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const loginResult = await usersModel.login(email, password);
    res.status(200).json({
      message: "Login successful",
      authToken: loginResult.authToken,
    });
  } catch (err) {
    if (err instanceof Error) {
      // Map specific error messages to appropriate HTTP status codes
      if (err.message === "User not found" || err.message === "Credentials invalid") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "Email not verified") {
        return res.status(403).json({ message: err.message });
      }
    }
    console.error(err);
    res.status(400).json({
      message: "Login attempt failed. Please check your credentials and try again.",
    });
  }
}

export { userRouter };
*/
    

