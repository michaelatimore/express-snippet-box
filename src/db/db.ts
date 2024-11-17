import assert from "assert";
import pg from "pg";
import { Users } from "../models/userModel.js";
import { Tokens } from "../models/tokenModel.js";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
assert(!!connectionString, "environment variable DATABASE_URL not set");

export const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Users: new Users(pool),
    Tokens: new Tokens(pool),
  },
};
