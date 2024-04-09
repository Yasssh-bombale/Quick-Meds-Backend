import { Request, Response } from "express";
import User from "../models/user.model";
import { customRequest } from "../middleware/auth";

export const getAllUsers = async (req: customRequest, res: Response) => {
  try {
    const user = await User.find({});
    console.log(req.user);

    return res.status(200).json({ user });
  } catch (error) {
    console.log(`ERROR ${error}`);
  }
};
