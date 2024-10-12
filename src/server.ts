import express from "express";
import { pool } from "./db/db.js";
import "dotenv/config";

//create express app
const app = express();
const PORT = process.env.PORT ?? 3000;

//setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  res.json({ serverMessage: "Hello world!" });
});

import { rootRouter } from "./routes/root.js";
import { userRouter } from "./routes/user.js";
import { snippetRouter } from "./routes/snippets.js";

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/snippets", snippetRouter);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`server running at http://localhost:${PORT}`);
  }
});
