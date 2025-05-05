import AnalyticsService from "#services/analytics/index.js";
import { AuthenticatedRequest } from "#types/request.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";

const GetAnalytics = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const analytics = await AnalyticsService.getAnalytics({
      clinic_id: req.auth.user.id,
      channel: req.query.channel,
      groupBy: req.query.groupBy,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
    res.json(analytics);
  }
);

const AnalyticsController = {
  GetAnalytics,
};

export default AnalyticsController;
