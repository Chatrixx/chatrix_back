import AnalyticsService from "#services/analytics/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
const GetAnalytics = catchAsync(async (req, res) => {
    const analytics = await AnalyticsService.getAnalytics({
        clinic_id: req.auth.user.id,
        channel: req.query.channel,
        groupBy: req.query.groupBy,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    });
    res.json(analytics);
});
const AnalyticsController = {
    GetAnalytics,
};
export default AnalyticsController;
