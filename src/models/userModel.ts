import type pg from "pg";
import bcrypt from "bcrypt";
import assert from "assert";
import {
  validateEmail,
  validatePassword,
  validateFields,
} from "./validator.js";

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

/*async userLogin(email: string, password: string) {
    // Validate email and password
    if (!email) {
      throw new Error("Email is missing");
    }
  
    const emailRx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
      const result = await this.pool.query("SELECT * FROM users WHERE email = $1", [email]);
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
      /*
      if (!user.email_verified) {
        throw new Error("Email not verified");
      }
      
  
      // Return the user if login is successful
      return user;
    } catch (err) {
      console.error("Login failed: ", err);
      throw err;
    }
  }
}*/
