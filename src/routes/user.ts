import { Router } from "express";
import { pool } from "../db/db.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

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
  if (!email) {//is there an email
    return res.status(400).json({ message: "Email is missing" });//Bad Request
  }
  // Email format validation using string.match() and a regex. The match() method of String values retrieves the result of matching this string against a regular expression.
  const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "invalid email format" });
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
  if (password.length < 8){
    return res.status(400).json({ message: "Minimum password length is 8 characters"})
  }

  try {
    const passwordHash = await bcrypt.hash(password,10)
    //prepare the SQL query for updating the snippet
    const newUser = await pool.query(//prepared statement
      "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, firstName, lastName, passwordHash, false]
    );
    res.status(201).json(newUser.rows[0]);//returns the result object and uses it's rows property to get the result of the query
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });//Internal Server Error
  }
}

  /*
  validation of data that is required: email, first_name, last_name, password
    
  AUTHENTICATION: STEPS TO VERIFY THE USER. LOOK UP THE USER FROM THE DATABASE, GET THE PASSWORD HASH FROM THE DATABASE, AND USE BCRYPT.COMPARE TO VERIFY THE PASSWORD
  get the email and password from the request body
  validate the email and password
  get user from the database by email
  use bcrypt.compare to verify the password
 
  do a fetch request to get the user
  return the user
  return a json error message that says not verified 
  */

async function userLogin(req: Request, res: Response) {
  // Get the email and password from the request body
  const { email, password } = req.body;

  // Validate the email
  if (!email) {//is there an email
    return res.status(400).json({ message: "Email is missing" });//Bad Request
  }
  // Email format validation using string.match() and a regex. The match() method of String values retrieves the result of matching this string against a regular expression.
  const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  if (!email.match(emailRx)) {
    return res.status(400).json({ message: "invalid email format" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is missing" });
  }
  if (password.length < 8){
    return res.status(400).json({ message: "Minimum password length is 8 characters"})
  }

  try {
    // Get user from the database by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Use bcrypt.compare to verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    /* bcrypt.compare() takes the plain-text password and the hashed password, then checks if the plain-text password matches the original password used to create the hash.
    bcrypt works by hashing the plain-text password using the same algorithm and "salt" (random data added to the hash) that was used to hash the original password. It compares the result to the stored hashed password. */

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Check if the email in the database matches the email from the request
    if (email !== user.email) {
      return res.status(400).json({ message: "Email does not match records" });
    }

    // Check if the user's email is verified
    if (!user.email_verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Authentication successful
    res.status(200).json({ 
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { userRouter}

/*Validation and authentication
Session Cookies Overview
A session cookie is a temporary cookie that is stored in memory for the duration of a user's session and gets deleted when the session ends (e.g., when the browser is closed). In a typical web application, session cookies are used to store information that persists across multiple HTTP requests, such as:

User authentication status (logged-in or not).
User-specific information (e.g., user ID or permissions).
Temporary data (e.g., items in a shopping cart).
In the context of user authentication, session cookies play a critical role in maintaining the login state of a user between HTTP requests, which are stateless by default. Once a user successfully logs in, a session cookie can be set to identify the user on subsequent requests without the need to log in again for every request.
Why Session Cookies Are Needed in This Code Block
In the userLogin function, the user successfully logs in if the provided email and password match the database records. However, this code does not currently maintain the login state after a successful login. Each time the user makes a request, they would need to provide their credentials again. Session cookies would allow the application to:

Maintain User Login State: Once the user successfully logs in, a session cookie can be set, allowing the server to recognize the user in future requests without requiring repeated logins.

Securely Store User Session Data: Rather than sending sensitive data like passwords with every request, a session cookie can be used to store a session identifier, which refers to a secure session on the server.

Track User Activity: If needed, session cookies can help track user interactions with the app, ensuring a personalized experience or enabling security features like session timeout
*/



