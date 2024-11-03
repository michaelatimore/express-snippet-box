import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";

type TokenModel = {
  plaintext: string;
  hash: string;
  expiry: number;
  userId: number;
};

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", userLogin);
/*
userRouter.get("/:userId", getUserById);
userRouter.put("/:userId", updateUser);
userRouter.delete("/:userId", deleteUser);
*/

async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is missing" }); //Bad Request
  }

  const emailRx =
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!firstName) {
    return res.status(400).json({ message: "First name is missing" });
  }
  if (!lastName) {
    return res.status(400).json({ message: "Last name is missing" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is missing" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Minimum password length is 8 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    //prepare the SQL query for updating the snippet
    const newUser = await pool.query(
      //prepared statement
      "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, firstName, lastName, passwordHash, false]
    );
    res.status(201).json(newUser.rows[0]); //returns the result object and uses it's rows property to get the result of the query
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" }); //Internal Server Error
  }
}

async function userLogin(req: Request, res: Response) {
  //1.Get the email and password from the request body
  const { email, password } = req.body;
  console.log(req.body);

  //2.Validate the email and password
  if (!email) {
    return res.status(400).json({ message: "Email is missing" }); //Bad Request
  }

  const emailRx =
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is missing" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Minimum password length is 8 characters" });
  }

  try {
    //3.get user from the database by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    //4.return the user
    const user = result.rows[0];
    console.log(user.password);
    //5.Use bcrypt.compare to verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials invalid" });
    }

    //6.check if the user's email is verified
    /*if (!user.email_verified) {
      return res.status(403).json({ message: "Email not verified" });
    }*/

    // generate a random token plaintext
    const plaintext = randomBytes(32).toString();
    // compute the hash of the plaintext
    const hash = createHash("sha256").update(plaintext).digest("hex");
    // compute the expiration time of the token
    const expiry = Math.trunc(Date.now() / 1000) + 60 * 60 * 24 * 30;

    // create a token with the plaintext, hash, and expiry
    const token: TokenModel = {
      plaintext,
      hash,
      expiry,
      userId: user.id,
    };

    // insert the token into the database
    const sql =
      "insert into tokens (hash, expiry, user_id) values ($1, $2, $3)"; //prepared statement
    const params = [token.hash, token.expiry, token.userId];
    await pool.query(sql, params);

    /*
      The token is now stored in the database, and the plain text version is
      returned as the authentication token. This token is used to authenticate
     * the user in the future.
     */

    //7.authentication successful
    res.status(200).json({
      message: "Login successful",
      authToken: token.plaintext,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message:
        "Login attempt failed. Please check your credentials and try again.",
    });
  }
}

export { userRouter };

/*
  validation of data that is required: email, first_name, last_name, password

  async function userLogin
    
  AUTHENTICATION: STEPS TO VERIFY THE USER. LOOK UP THE USER FROM THE DATABASE, GET THE PASSWORD HASH FROM THE DATABASE, AND USE BCRYPT.COMPARE TO VERIFY THE PASSWORD
  1. get the email and password from the request body
  2. validate the email and password
  3. get user from the database by email
  4. return the user
  5. use bcrypt.compare to verify the password
  6. check if the user's email is verified
  7. authentication successful   
  return a json error message that says not verified 

  // Email format validation using string.match() and a regex. The match() method of String values retrieves the result of matching this string against a regular expression.  

  bcrypt.compare() takes the plain-text password and the hashed password, then checks if the plain-text password matches the original password used to create the hash.
  bcrypt works by hashing the plain-text password using the same algorithm and "salt" (random data added to the hash) that was used to hash the original password. It compares the result to the stored hashed password.
  */
