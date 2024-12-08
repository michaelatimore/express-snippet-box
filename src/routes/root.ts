//making a router

import { Router } from "express";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  console.log(req);
  res.json({ status: "Available" });
});

export { rootRouter };
