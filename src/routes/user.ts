import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { authenticate } from "../middleware/auth.js"; //checks if a user is authenticated before allowing them to access a protected route.
import { validateEmail, validateId } from "../models/validator.js";
import { nodemailerUser } from "../constants.js";
import { transporter } from "../mailer/mailer.js";
import type { Token } from "nodemailer/lib/xoauth2/index.js";
import { scope } from "../models/tokenModel.js";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.post("/login", userLogin);
userRouter.get("/", authenticate, getUserById);
userRouter.put("/", authenticate, updateUser);
userRouter.delete("/", authenticate, deleteUser);
//change the password: trigger for user to send email to an endpoint and receive a code. Both go back to the server with the new password
userRouter.post("/reset", sendResetEmail);
// make put request to verify code and update users password
userRouter.put("/", resetPassword);

async function createUser(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  try {
    const newUser = await db.Models.Users.createUser(
      email,
      firstName,
      lastName,
      password
    );
    res.status(201).json(newUser); //successful request resulting in the creation of a new resource
  } catch (err) {
    console.error("Failed to create user: ", err);
    return null;

    /*if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to create user" });
    }*/
  }
}

async function userLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await db.Models.Users.userLogin(email, password);
    res.status(200).json({
      //indicates that the request was successful and the server has returned the expected response.
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.error("Login failed: ", err);
    return null;

    /*if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to login" });
    }
  }*/
  }
}

async function getUserById(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const user = await db.Models.Users.getUserById(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to get user by ID: ", err);
    return null;

    /*if (err instanceof Error) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to get user" });
    }*/
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
      lastName
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Failed to update user: ", err);
    return null;

    /*if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to update user" });
    }*/
  }
}

async function deleteUser(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const deletedUserId = db.Models.Users.deleteUser(userId);
    res.status(200).json(deletedUserId);
  } catch (err) {
    console.error("Failed to delete user: ", err);
    return null;

    /*if (err instanceof Error) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete user" });//error messages need to be less explicit
    }*/
  }
}
async function sendResetEmail(req: Request, res: Response) {
  const email = req.body.email;
  try {
    validateEmail(email);
    const user = await db.Models.Users.getUserByEmail(email);
    const resetToken = await db.Models.Tokens.generatePasswordResetToken(
      user.id
    );
    const emailTemplate = {
      from: `"Snippet Box - No Reply" <${nodemailerUser}>`, //sender address
      to: email, //recipient
      subject: "Password Reset - Snippet Box", //subject line
      text: `We have received a request to reset your password.\n\n To reset your password, send  a PUT request with your code and new password to  /users/reset?code=\n\n Your code is: ${resetToken}\n\n If you did not make this request, you can safely ignore this email. Sincerely, \n\nSnippet Box Team`,
    };
    const result = await transporter.sendMail(emailTemplate);
    if (!result) {
      return res
        .status(500)
        .json({ message: "Server failed to process request" });
    }
    return res.status(202).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error(err); //fix the error handling. make sure the error messages are generic
    if (err instanceof Error) {
      console.error(err);
      res.status(400).json({ message: "Request could not be processed" });
    } else {
      res.status(500).json({ message: "Server failed to process request" });
    }
  }
}

async function resetPassword(req: Request, res: Response) {
  const { password, resetToken, userId } = req.body;

  try {
    const passwordReset = await db.Models.Users.resetPassword(
      password,
      resetToken,
      userId
    );
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Failed to reset password: ", err);
    res.status(500).json({ message: "Server failed to process request" });
  }
}

export { userRouter };
