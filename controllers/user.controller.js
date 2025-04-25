import UserService from "../services/users/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const Getme = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await UserService.getMe(userId);
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

const UserController = {
  Getme,
};
export default UserController;
