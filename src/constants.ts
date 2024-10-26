import "dotenv/config";
import assert from "assert";

export const connectionString = process.env.DSN;

assert(
  connectionString,
  "Connection string is required. Set DSN environment variable."
);


/*
import "dotenv/config";:

This line imports and immediately configures the dotenv package, which is responsible for loading environment variables from a .env file into process.env.
This means that any variables defined in the .env file (such as database credentials) will be available in process.env in the Node.js environment.

import assert from "assert";:

This imports the assert module from Node.js, which provides a way to perform validations in the code. If the assertion condition evaluates to false, the application will throw an error and stop.

export const connectionString = process.env.DSN;:

This line exports a constant connectionString, which retrieves the value of the DSN (Data Source Name) environment variable from process.env.
The DSN typically contains information required to connect to a Postgres database, such as the database URL, username, password, and host
assert(connectionString, "Connection string is required. Set DSN environment variable.");:

The assert function is used to check whether connectionString is defined. If it's undefined or null, the application will throw an error with the message "Connection string is required. Set DSN environment variable."
This is a safeguard to ensure that the database connection string is always provided when the app starts. Without the DSN, the app would be unable to connect to the Postgres database.*/ 