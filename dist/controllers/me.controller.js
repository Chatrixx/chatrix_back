import UserService from "#services/me/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
const Getme = catchAsync(async (req, res) => {
    const userId = req.auth.user.id;
    const user = await UserService.getMe(userId);
    res.status(200).json(user);
});
const MeController = {
    Getme,
};
export default MeController;
