import TestService from "#services/test/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
const SendMessage = catchAsync(async (req, res) => {
    await TestService.sendMessage(req.body.input, req.auth.user.id);
    res
        .status(200)
        .json({ message: "Message is taken, will be handled soon." });
});
const GetAllMessages = catchAsync(async (req, res) => {
    const data = await TestService.getAllMessages(req.auth.user.id);
    res.status(200).json(data);
});
const TestController = {
    SendMessage,
    GetAllMessages,
};
export default TestController;
