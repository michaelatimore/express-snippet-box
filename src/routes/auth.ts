import type { Request, Response, NextFunction } from "express";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Authorization header looks like this:
  //Authorization: 'Bearer ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  //split on the space, get the second element, which will be the token
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  //TODO: verify the token is valid in the database
  next();
}
