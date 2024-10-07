import "dotenv/config";
import assert from "assert";

export const connectionString = process.env.DSN;

assert(
  connectionString,
  "Connection string is required. Set DSN environment variable."
);
