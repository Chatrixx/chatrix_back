import AuthService from "../services/auth/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const SignIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.signin({ email, password });
  res.setHeader("Authorization", token);
  res.status(200).json({ message: "Sign in successful" });
});

const SignUp = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.signup({ email, password });
  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(201).json({ message: "Signup Success" });
});

const AuthController = {
  SignIn,
  SignUp,
};
export default AuthController;
