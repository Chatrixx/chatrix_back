import AuthService from "#services/auth/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Request, Response } from "express";

const SignIn = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await AuthService.signin({ email, password });
  res.setHeader("Authorization", token);
  res.status(200).json({ message: "Sign in successful" });
});

const SignUp = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await AuthService.signup({ email, password });
  res.setHeader("Authorization", `Bearer ${String(token)}`);
  res.status(201).json({ message: "Signup Success" });
});

const AuthController = {
  SignIn,
  SignUp,
};
export default AuthController;
