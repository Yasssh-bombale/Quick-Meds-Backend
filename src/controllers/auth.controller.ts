import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    //checking size of username;
    if (username.length < 7 || username.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 7-20 characters" });
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: "Username can contain letters and numbers only" });
    }

    if (username !== username.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Username must be in lower case" });
    }
    if (username.includes(" ")) {
      return res
        .status(400)
        .json({ message: "Username can not contain spaces" });
    }
    // check for password;
    if (password.length < 7) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //check for user already eixits in dataBase
    const isEmailTaken = await User.findOne({ email });
    const isUserNameTaken = await User.findOne({ username });

    if (isEmailTaken || isUserNameTaken) {
      return res.status(401).json({
        message: isEmailTaken
          ? "User already exists!"
          : "Username already taken",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10); //hashing password

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User sign up successfully",
    });
  } catch (error) {
    console.log(`ERROR:In SignUp auth controller ${error}`);
  }
};
export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  //check for validUser;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }
    //check for password;
    const isPasswordMatch = bcryptjs.compareSync(password, validUser.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // create token for cookie;
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET_KEY as string
    );

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User signed in",
        user: validUser,
      });
  } catch (error) {
    console.log(`ERROR:In signIn auth controller ${error}`);
  }
};
export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "User signout successfully!",
    });
  } catch (error) {
    console.log(`ERROR:IN SIGNOUT CONTROLLER ${error}`);
  }
};
