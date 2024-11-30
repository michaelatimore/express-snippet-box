import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";
import {
  validateEmail,
  validatePassword,
  validateFields,
  validateId,
} from "./validator.js";
import { db } from "../db/db.js";

type UserModel = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class User {
  private pool: pg.Pool;

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

  async userLogin(email: string, password: string) {
    // Validate email and password
    if (!email) {
      throw new Error("Email is missing");
    }
    const emailRx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email.match(emailRx)) {
      throw new Error("Invalid email format");
    }
    if (!password) {
      throw new Error("Password is missing");
    }
    if (password.length < 8) {
      throw new Error("Minimum password length is 8 characters");
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
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Credentials invalid");
      }

      // Check if the user's email is verified (commented out for now)
      if (!user.email_verified) {
        throw new Error("Email not verified");
      }

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

  async getUserById(id: string) {
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
    id: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string
  ) {
    try {
      // Validate the provided user ID
      validateId(id);

      // Validate optional fields if provided
      if (email) validateEmail(email);
      if (password) validatePassword(password);

      // Validate fields if firstName or lastName is provided
      if (firstName || lastName) {
        validateFields(email!, firstName!, lastName!, password!);
      }

      // Initialize the SQL update query and parameters array
      let updateUserQuery = "UPDATE users SET ";
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
      // Hash the password and append to the query if provided
      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateUserQuery += "password = $5, ";
        params.push(passwordHash);
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

  async deleteUser(id: string | undefined) {
    if (!id) {
      throw new Error("User ID is required");
    }
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
  }
}
