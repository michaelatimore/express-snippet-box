import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";
import {
  validateEmail,
  validatePassword,
  validateFields,
  validateId,
  validatePasswordAgainstHash,
} from "./validator.js";
import { db } from "../db/db.js";
import type { Token } from "nodemailer/lib/xoauth2/index.js";
import { scope } from "./tokenModel.js";
import { error } from "console";

type UserModel = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class User {
  pool: pg.Pool;

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
      //trigger for user to send email to an endpoint and recieve a code. Both go back to the server with the new password

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await this.pool.query(
        "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [email, firstName, lastName, passwordHash, false]
      );
      return { id: newUser.rows[0].id, email, firstName, lastName };
    } catch (err) {
      console.error("Failed to create user: ", err);
      throw err; //throw the error so I can access it in user.ts
    }
  }

  async userLogin(email: string, password: string) {
    const emailRx =
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
    // Validate email and password
    validateEmail(email);
    if (password) {
      if (password) validatePassword(password);
    }

    try {
      // Get user from the database by email
      const result = await this.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      // Get the user
      const user = result.rows[0];

      // Verify the password
      validatePasswordAgainstHash(password, user.password);

      // if (!user.email_verified) {
      //   throw new Error("Email not verified");
      // }

      // Generate authentication token
      const authToken = await db.Models.Tokens.generateAuthenticationToken(
        user.id
      );

      // Return the user and token if login is successful
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        authToken,
      };
    } catch (err) {
      console.error("Login failed: ", err);
      throw err;
    }
  }

  async getUserById(id: number) {
    try {
      validateId(id);
      const result = await this.pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
      };
    } catch (err) {
      console.error("Failed to get user by ID: ", err);
      throw err;
    }
  }

  async updateUser(
    // ? =  Optional parameters
    id: number,
    email?: string,
    firstName?: string,
    lastName?: string
  ) {
    try {
      // Validate the provided user ID
      validateId(id);

      // Validate optional fields if provided
      if (email) validateEmail(email);

      // Initialize the SQL update query and parameters array
      let updateUserQuery = "UPDATE users SET "; //updating the users table and setting new values for certain columns.
      const params: any[] = [id];

      // Append email to the query if provided
      if (email) {
        updateUserQuery += "email = $2, ";
        params.push(email);
      }
      // Append first name to the query if provided
      if (firstName) {
        updateUserQuery += "first_name = $3, ";
        params.push(firstName);
      }
      // Append last name to the query if provided
      if (lastName) {
        updateUserQuery += "last_name = $4, ";
        params.push(lastName);
      }

      // Remove the trailing comma and space from the query
      updateUserQuery = updateUserQuery.trim().replace(/, $/, "");

      // Complete the query by adding the condition to update the specific user
      updateUserQuery +=
        " WHERE id = $1 RETURNING id, email, first_name, last_name";

      // Execute the query with the parameters
      const result = await this.pool.query(updateUserQuery, params);

      // Check if the user was found and updated
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      // Return the updated user information
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
      };
    } catch (err) {
      // Log error and rethrow it
      console.error("Failed to update user: ", err);
      throw err;
    }
  }

  async deleteUser(id: number) {
    try {
      validateId(id);
      const result = await this.pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return { id: result.rows[0].id };
    } catch (err) {
      console.error("Failed to delete user: ", err);
      throw err;
    }
  }

  async getUserByEmail(email: string) {
    try {
      validateEmail(email);
      const result = await this.pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }
      return {
        id: result.rows[0].id,
        email: result.rows[0].email,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        passwordHash: result.rows[0].password,
      };
    } catch (err) {
      console.error("Failed to get user by email: ", err);
      throw err;
    }
  }

  async resetPassword(password: string, resetToken: string, userId: number) {
    try {
      //check if the required fields are present
      if (!password || !resetToken || !userId) {
        throw new Error("Missing required fields");
      }
      const user = await db.Models.Tokens.getUserForToken(resetToken);

      //getUserForToken will call getUserById. Use this to compare the user id from the token to the user id from the request. Verifies the validity of the token.
      if (!user || user.id !== userId) {
        console.error("Invalid request ", error);
        throw error;
      }
      //hash the new password
      const passwordHash = await bcrypt.hash(password, 10);

      //upsate the user's password in the database
      const newPassword = await this.pool.query(
        "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
        [passwordHash, userId]
      );
      return { id: newPassword.rows[0].id }; //just return the id of the user
    } catch (err) {
      console.error("Failed to change password: ", err);
      throw err;
    }
  }
}
