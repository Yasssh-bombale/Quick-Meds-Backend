import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

// req.user is not in the Request of express ; extending express by custom interface;

type UserType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
};

export interface customRequest extends Request {
  user?: any;
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decoded = jwt.verify(
      access_token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized token" });
    }

    (req as customRequest).user = user;
    next();
  } catch (error) {
    console.log(`ERROR:IN AUTH MIDDLEWARE , ${error}`);
  }
};
