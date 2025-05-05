import UserService from "#services/me/index.js";
import { AuthenticatedRequest } from "#types/request.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";

const Getme = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.auth.user.id;
  const user = await UserService.getMe(userId);
  res.status(200).json(user);
});

const MeController = {
  Getme,
};
export default MeController;
