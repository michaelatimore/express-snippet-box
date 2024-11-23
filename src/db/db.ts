import assert from "assert";
import pg from "pg";
import { User } from "../models/userModel.js";
import { Tokens } from "../models/tokenModel.js";
import { Snippet } from "../models/snippetModel.js";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
assert(!!connectionString, "environment variable DATABASE_URL not set");

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Users: new User(pool),
    Tokens: new Tokens(pool),
    Snippet: new Snippet(pool),
  },
};
