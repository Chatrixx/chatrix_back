import UserService from "../services/user/index.js";

async function Getme(req, res, next) {
  try {
    const userId = req.user.userId;
    const user = await UserService.getMe(userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(403).json({ message: "Invalid user id" });
  }
}

const UserController = {
  Getme,
};
export default UserController;
