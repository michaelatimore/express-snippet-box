import { createHash, randomBytes } from "crypto";
import type pg from "pg";
import assert from "assert";

export class Tokens {
  pool: pg.Pool;
  constructor(pool: pg.Pool) {
    assert(pool, "pool is required");
    this.pool = pool;
  }
  async generateAuthenticationToken(userId: string) {
    // generate a random token plaintext
    const plaintext = randomBytes(32).toString("base64url");
    // compute the hash of the plaintext
    const hash = createHash("sha256").update(plaintext).digest("hex");
    // compute the expiration time of the token
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    // insert the token into the database
    const sql =
      "insert into tokens (hash, expiry, user_id) values ($1, $2, $3)"; //prepared statement
    const params = [hash, expiry, userId];
    await this.pool.query(sql, params);

    return plaintext;
  }
}
