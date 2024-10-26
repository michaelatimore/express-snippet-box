import express from "express";
import { pool } from "./db/db.js";
import "dotenv/config";

//create express app
const app = express();
const PORT = process.env.PORT ?? 3000;

//built-in middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/hello", (req, res) => {//http://localhost:PORT/hello
  res.json({ serverMessage: "Hello world!" });
});


import { rootRouter } from "./routes/root.js";
import { userRouter } from "./routes/user.js";
import { snippetRouter } from "./routes/snippets.js";

//setting up the request processing pipeline for your Express application
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/snippets", snippetRouter);

app.listen(PORT, () => {//start the server
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});