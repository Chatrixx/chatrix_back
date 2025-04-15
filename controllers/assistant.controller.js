import AssistantService from "../services/assistant/index.js";

const AssistantController = {
  async getInstructions(req, res, next) {
    try {
      const response = await AssistantService.getInstructions(req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  },

  async updateInstructions(req, res, next) {
    try {
      const response = await AssistantService.updateInstructions(req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  },
};

export default AssistantController;
