import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { ensureAuthenticated } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", userLogin);

userRouter.get("/", ensureAuthenticated, getUserById);
userRouter.put("/", ensureAuthenticated, updateUser);
userRouter.delete("/", ensureAuthenticated, deleteUser);

async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); // successful request resulting in the creation of a new resource
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }
  }
}

async function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await db.Models.Users.userLogin(email, password);
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to login" });
    }
  }
}

async function getUserById(req: Request, res: Response) {
  const userId = req.user!.id;
  try {
    if (!req.params.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const user = await db.Models.Users.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to get user" });
    }
  }
}
type updateUserParams = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
async function updateUser(req: Request, res: Response) {
  const userId = req.user!.id;

  const { email, firstName, lastName, password } = req.body as updateUserParams;
  try {
    const updatedUser = db.Models.Users.updateUser(
      userId,
      email,
      firstName,
      lastName,
      password
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to update user" });
    }
  }
}

async function deleteUser(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const deletedUserId = db.Models.Users.deleteUser(userId);
    res.status(200).json(deletedUserId);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
}

export { userRouter };

/* validation of data that is required: email, first_name, last_name, password
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

  Email format validation using string.match() and a regex. The match() method of String values retrieves the result of matching this string against a regular expression.  

  bcrypt.compare() takes the plain-text password and the hashed password, then checks if the plain-text password matches the original password used to create the hash.
  bcrypt works by hashing the plain-text password using the same algorithm and "salt" (random data added to the hash) that was used to hash the original password. It compares the result to the stored hashed password.
  */
