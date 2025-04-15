import AuthService from "../services/auth/index.js";

async function Signin(req, res, next) {
  try {
    const { email, password } = req.body;

    const token = await AuthService.signin({ email, password });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Sign in successful" });
  } catch (error) {
    next(error);
  }
}
async function Signup(req, res, next) {
  try {
    const { email, password } = req.body;
    const token = await AuthService.signup({ email, password });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(201).json({ message: "Signup Success" });
  } catch (error) {
    next(error);
  }
}

const AuthController = {
  Signin,
  Signup,
};
export default AuthController;
