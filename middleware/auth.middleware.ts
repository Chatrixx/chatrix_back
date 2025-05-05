import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface UserToBeAuthenticated {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

const auth = (
  req: Request & { auth: { user: UserToBeAuthenticated } },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.auth = { user: decoded as UserToBeAuthenticated };

    next();
  } catch (err) {
    console.log(err);

    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default auth as RequestHandler;
