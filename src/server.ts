import express from "express";
import "dotenv/config";
import { authenticate } from "./middleware/auth.js";

//create express app
const app = express();
const PORT = process.env.PORT ?? 3000;

//built-in middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticate);

app.get("/hello", (req, res) => {
  //http://localhost:PORT/hello
  console.log(req.user, "This is the user");
  res.json({ serverMessage: "Hello world!" });
});

import { rootRouter } from "./routes/root.js";
import { userRouter } from "./routes/user.js";
import { snippetRouter } from "./routes/snippet.js";

//setting up the request processing pipeline for your Express application
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/snippets", snippetRouter);

app.listen(PORT, () => {
  //start the server
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
