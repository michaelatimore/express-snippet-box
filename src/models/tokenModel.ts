import { createHash, randomBytes } from "crypto";
import type pg from "pg";
import assert from "assert";
import { db } from "../db/db.js";

export enum scope {
  AUTHENTICATION = "authentication",
  PASSWORD_RESET = "password",
}

export class Tokens {
  pool: pg.Pool;
  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }
  async generateAuthenticationToken(userId: string) {
    //token can only be used for authentication
    // generate a random token plaintext
    const plaintext = randomBytes(32).toString("base64url");

    // compute the hash of the plaintext
    const hash = createHash("sha256").update(plaintext).digest("hex");

    // compute the expiration time of the token
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    // insert the token into the database
    const sql =
      "insert into tokens (hash, expiry, user_id, scope) values ($1, $2, $3, $4)"; //prepared statement
    const params = [hash, expiry, userId, scope.AUTHENTICATION];
    await this.pool.query(sql, params);

    return plaintext;
  }

  async generatePasswordResetToken(userId: string) {
    //token can only be used for password reset
    // generate a random token plaintext
    const plaintext = randomBytes(32).toString("base64url");

    // compute the hash of the plaintext
    const hash = createHash("sha256").update(plaintext).digest("hex");

    // compute the expiration time of the token
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60;

    // insert the token into the database
    const sql =
      "insert into tokens (hash, expiry, user_id, scope) values ($1, $2, $3, $4)"; //prepared statement
    const params = [hash, expiry, userId, scope.PASSWORD_RESET];
    await this.pool.query(sql, params);

    return plaintext;
  }

  async getUserForToken(token: string) {
    // Hash the given token using SHA-256
    const hash = createHash("sha256").update(token).digest("hex");

    // Use the hash to lookup the token data in the database
    const result = await this.pool.query(
      "SELECT * FROM tokens WHERE hash = $1",
      [hash]
    );

    // Check that the data was found
    if (result.rows.length === 0) {
      return null;
    }

    // Get the user's ID and the expiry from the token data
    const userId = result.rows[0].user_id;
    const expiry = result.rows[0].expiry;

    // Check that the expiry is in the future
    if (expiry < Date.now() / 1000) {
      return null;
    }

    // Fetch the user's data from the Users model using the userId
    try {
      const user = await db.Models.Users.getUserById(userId);
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
