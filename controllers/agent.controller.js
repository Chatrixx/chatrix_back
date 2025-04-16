import AgentService from "../services/agent/index.js";

const AgentController = {
  async sendMessage(req, res, next) {
    try {
      const response = await AgentService.sendMessage(
        req.body,
        req.user?.userId
      );
      res.status(response.status || 200).json(response.data);
    } catch (error) {
      next(error); // global error handler
    }
  },

  async getFreshMessages(req, res, next) {
    try {
      const response = await AgentService.getFreshMessages(
        req.body,
        req.user?.userId
      );
      res.status(response.status || 200).json(response.data);
    } catch (error) {
      next(error);
    }
  },
};

export default AgentController;
