import express from "express";
import user from "../../../db/models/user.js";
import { CHANNELS } from "../../../enum/channels.js";
import dbConnect from "../../../db/mongodb.js";

const router = express.Router();

const getAnalytics = async (
  startDate,
  endDate,
  channel = CHANNELS.INSTAGRAM,
  groupBy = "day" // 'day' or 'month'
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  try {
    await dbConnect();

    // Define the date group format (day or month)
    const dateFormat =
      groupBy === "month"
        ? {
            $dateToString: {
              format: "%Y-%m",
              date: `$channels.${channel}.first_message_date`, // Direct access to the field
            },
          }
        : {
            $dateToString: {
              format: "%Y-%m-%d",
              date: `$channels.${channel}.first_message_date`, // Direct access to the field
            },
          };

    const analyticsPipeline = [
      {
        $match: {
          [`channels.${channel}.first_message_date`]: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $project: {
          first_message_date: `$channels.${channel}.first_message_date`, // Direct access to the field
          phone_giving_date: `$channels.${channel}.phone_giving_date`, // Direct access to the field
          formattedDate: dateFormat, // Format the date based on the groupBy value
        },
      },
      {
        $group: {
          _id: "$formattedDate", // Group by formatted date (either day or month)
          totalMessengers: { $sum: 1 },
          totalPhoneNumbersGiven: {
            $sum: {
              $cond: [
                { $ne: ["$phone_giving_date", null] }, // Ensure phone_giving_date is not null
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date (ascending)
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalMessengers: 1,
          totalPhoneNumbersGiven: 1,
          phoneNumberGivingRatio: {
            $cond: {
              if: { $eq: ["$totalMessengers", 0] },
              then: 0,
              else: {
                $divide: ["$totalPhoneNumbersGiven", "$totalMessengers"],
              },
            },
          },
        },
      },
    ];

    const result = await user.aggregate(analyticsPipeline);

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch analytics");
  }
};

router.get("/", async (req, res) => {
  try {
    const analytics = await getAnalytics(
      req.query.startDate,
      req.query.endDate,
      req.query.channel ?? CHANNELS.INSTAGRAM,
      req.query.groupBy ?? "day"
    );

    const total_messengers = analytics.reduce(
      (acc, curr) => acc + curr.totalMessengers,
      0
    );
    const total_phone_numbers_given = analytics.reduce(
      (acc, curr) => acc + curr.totalPhoneNumbersGiven,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        data_series: analytics,
        total_messengers,
        total_phone_numbers_given,
        total_phone_ratio:
          (total_phone_numbers_given / total_messengers).toFixed(2) * 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

export default router;
