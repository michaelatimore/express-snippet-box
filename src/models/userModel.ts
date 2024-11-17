import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";
import {
  validateEmail,
  validatePassword,
  validateFields,
} from "./validator.js";
import { Tokens } from "./tokenModel.js";

// type UserModel = {
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
// };

export class User {
  private pool: pg.Pool;
  user: any;

  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }

  async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) {
    try {
      validateFields(email, firstName, lastName, password);

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await this.pool.query(
        "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [email, firstName, lastName, passwordHash, false]
      );
      return { id: newUser.rows[0].id, email, firstName, lastName };
    } catch (err) {
      console.error("Failed to create user: ", err);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }
    return {
      id: user.rows[0].id,
      email: user.rows[0].email,
      firstName: user.rows[0].first_name,
      lastName: user.rows[0].last_name,
      passwordHash: user.rows[0].password,
    };
  }

  async userLogin(email: string, password: string) {
    const tokens = new Tokens(this.pool);
    try {
      // Validate email and password
      validateEmail(email);
      validatePassword(password);

      // Get user from the database by email

      this.getUserByEmail(email);

      // Verify the password
      const isPasswordValid = await bcrypt.compare(
        password,
        this.user.passwordHash
      );
      if (!isPasswordValid) {
        throw new Error("Credentials invalid");
      }

      // Check if the user's email is verified

      if (!this.user.email_verified) {
        throw new Error("Email not verified");
      }
      const authenticationToken = tokens.generateAuthenticationToken(this.user.id);

      // Return the user if login is successful
      return this.user;
    } catch (err) {
      console.error("Login failed: ", err);
      throw err;
    }
  }
}
