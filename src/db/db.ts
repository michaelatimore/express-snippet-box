import pg from "pg";
import { connectionString } from "../constants.js";
import { assert } from "console";

const { Pool } = pg;
export const pool = new Pool({
  connectionString,
});
pool.connect((error) => {
  if (error) {
    console.error(error);
    throw new Error(`Failed to connect to database ${error}`);
  }
});
